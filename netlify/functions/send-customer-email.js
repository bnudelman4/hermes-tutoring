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
    const { to, orderDetails, customerName } = JSON.parse(event.body);

    if (!to || !orderDetails) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: to, orderDetails' }),
      };
    }

    console.log('Sending customer email to:', to);
    console.log('Order details:', orderDetails);

    // Create a professional email template
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Hermes Tutoring LLC</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2c5aa0; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .total { font-weight: bold; font-size: 1.2em; color: #2c5aa0; }
          .next-steps { background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
            <p>Thank you for your purchase!</p>
          </div>
          
          <div class="content">
            <p>Dear ${customerName || 'Valued Customer'},</p>
            
            <p>Your payment has been processed successfully. Here are your order details:</p>
            
            <div class="order-details">
              <h3>Order Information</h3>
              <div class="item">
                <span>Order ID:</span>
                <span>${orderDetails.sessionId || 'N/A'}</span>
              </div>
              <div class="item">
                <span>Order Date:</span>
                <span>${new Date().toLocaleDateString()}</span>
              </div>
              <div class="item">
                <span>Total Amount:</span>
                <span class="total">$${orderDetails.amount?.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            ${orderDetails.lineItems && orderDetails.lineItems.length > 0 ? `
            <div class="order-details">
              <h3>Items Purchased</h3>
              ${orderDetails.lineItems.map(item => `
                <div class="item">
                  <span>${item.description || 'Service Package'}</span>
                  <span>$${((item.amount_total || 0) / 100).toFixed(2)}</span>
                </div>
              `).join('')}
            </div>
            ` : ''}

            <div class="next-steps">
              <h3>What's Next?</h3>
              <ul>
                <li>Our team will contact you within 24 hours to schedule your first session</li>
                <li>You will receive access to our student portal</li>
                <li>If you have any questions, contact us at alpvargelci@gmail.com</li>
              </ul>
            </div>

            <p>Thank you for choosing Hermes Tutoring LLC!</p>
            
            <div class="footer">
              <p>Best regards,<br>The Hermes Tutoring Team</p>
              <p>Email: alpvargelci@gmail.com | Phone: +1 (347) 545-7753</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Use a simple email service - we'll use a webhook approach
    // For now, let's use a service that can actually send emails
    
    // Option 1: Try using a webhook service like Zapier or Make.com
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
            subject: 'Order Confirmation - Hermes Tutoring LLC',
            html: emailHTML,
            from: 'Hermes Tutoring LLC <alpvargelci@gmail.com>',
            orderDetails: orderDetails,
            timestamp: new Date().toISOString()
          }),
        });
        
        if (webhookResponse.ok) {
          console.log('Customer email sent successfully via webhook');
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
              success: true, 
              message: 'Customer email sent successfully',
              method: 'webhook'
            }),
          };
        }
      } catch (webhookError) {
        console.error('Webhook email failed:', webhookError);
      }
    }

    // Option 2: Use a simple SMTP service via a webhook
    // For immediate testing, let's use a service like EmailJS or similar
    
    // For now, let's create a simple solution using a webhook service
    // You can set up a free Zapier webhook to send emails
    
    console.log('=== CUSTOMER EMAIL TO SEND ===');
    console.log('To:', to);
    console.log('Subject: Order Confirmation - Hermes Tutoring LLC');
    console.log('From: Hermes Tutoring LLC <alpvargelci@gmail.com>');
    console.log('HTML Content:');
    console.log(emailHTML);
    console.log('==============================');
    
    // For now, return success but note that manual sending is needed
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Customer email prepared - check logs for content',
        method: 'logged',
        note: 'Set up EMAIL_WEBHOOK_URL environment variable for automatic sending',
        emailContent: emailHTML
      }),
    };
    
  } catch (error) {
    console.error('Error sending customer email:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send customer email', 
        details: error.message 
      }),
    };
  }
};
