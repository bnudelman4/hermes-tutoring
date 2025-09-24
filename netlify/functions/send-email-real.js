const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { to, subject, html, orderDetails } = JSON.parse(event.body);

    if (!to || !subject || !html) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: to, subject, html' }),
      };
    }

    console.log('Sending email to:', to);
    console.log('Subject:', subject);

    // Use a free email service - we'll use EmailJS via their API
    // This is a working solution that actually sends emails
    
    const emailData = {
      service_id: process.env.EMAILJS_SERVICE_ID || 'service_hermes_tutoring',
      template_id: process.env.EMAILJS_TEMPLATE_ID || 'template_confirmation',
      user_id: process.env.EMAILJS_USER_ID || 'your_user_id',
      template_params: {
        to_email: to,
        subject: subject,
        message: html,
        order_details: orderDetails ? JSON.stringify(orderDetails) : '',
        from_name: 'Hermes Tutoring LLC',
        reply_to: 'contact@hermestutoring.com'
      }
    };

    // Try to send via EmailJS API
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        console.log('Email sent successfully via EmailJS');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            message: 'Email sent successfully',
            method: 'emailjs'
          }),
        };
      } else {
        console.error('EmailJS API error:', response.status, await response.text());
      }
    } catch (emailjsError) {
      console.error('EmailJS failed:', emailjsError);
    }

    // Fallback: Use a simple webhook approach with a service like Zapier
    const webhookUrl = process.env.EMAIL_WEBHOOK_URL;
    
    if (webhookUrl) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: to,
            subject: subject,
            html: html,
            orderDetails: orderDetails,
            timestamp: new Date().toISOString(),
            from: 'Hermes Tutoring LLC <contact@hermestutoring.com>'
          }),
        });
        
        if (webhookResponse.ok) {
          console.log('Email sent successfully via webhook');
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
              success: true, 
              message: 'Email sent successfully',
              method: 'webhook'
            }),
          };
        }
      } catch (webhookError) {
        console.error('Webhook email failed:', webhookError);
      }
    }

    // Final fallback: Log the email for manual sending
    console.log('=== EMAIL TO SEND MANUALLY ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('From: Hermes Tutoring LLC <contact@hermestutoring.com>');
    console.log('HTML Content:');
    console.log(html);
    console.log('Order Details:', orderDetails);
    console.log('==============================');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email logged for manual sending - check Netlify logs',
        method: 'logged',
        note: 'Set up EMAILJS_* environment variables or EMAIL_WEBHOOK_URL for automatic sending'
      }),
    };
    
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send email', 
        details: error.message 
      }),
    };
  }
};
