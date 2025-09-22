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

    // Use a simple email service - we'll use a webhook approach
    // For now, let's use a service like Formspree or create a simple SMTP solution
    
    console.log('Attempting to send email to:', to);
    console.log('Subject:', subject);
    
    // Option 1: Use a webhook service like Zapier or Make.com
    // Option 2: Use a simple SMTP service
    // Option 3: Use a service like EmailJS (client-side) or SendGrid
    
    // For immediate implementation, let's use a simple approach with a webhook
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
            timestamp: new Date().toISOString()
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
    
    // Fallback: Log the email details for manual sending
    console.log('=== EMAIL TO SEND ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML Content:', html);
    console.log('Order Details:', orderDetails);
    console.log('===================');
    
    // For now, return success but log that manual sending is needed
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email logged for manual sending',
        method: 'logged',
        note: 'Set up EMAIL_WEBHOOK_URL environment variable for automatic sending'
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
