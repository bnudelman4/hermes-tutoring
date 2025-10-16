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
    const { to, subject, orderDetails, customerName } = JSON.parse(event.body);

    if (!to || !orderDetails) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: to, orderDetails' }),
      };
    }

    console.log('Sending order confirmation to:', to);
    console.log('Order details:', orderDetails);

    // Use Netlify Forms to send the email
    // This leverages the same email system that handles your contact form
    const formData = new URLSearchParams();
    formData.append('form-name', 'order-confirmation');
    formData.append('customer-email', to);
    formData.append('customer-name', customerName || 'Valued Customer');
    formData.append('order-id', orderDetails.sessionId || 'N/A');
    formData.append('order-total', `$${orderDetails.amount?.toFixed(2) || '0.00'}`);
    formData.append('order-items', JSON.stringify(orderDetails.lineItems || []));
    formData.append('order-date', new Date().toLocaleDateString());
    formData.append('subject', subject || 'Order Confirmation - Hermes Tutoring LLC');
    formData.append('message', `Order confirmation for ${orderDetails.sessionId || 'your recent purchase'}`);

    // Submit to Netlify Forms
    const netlifyResponse = await fetch(`${process.env.URL || 'https://hermestutoring.netlify.app'}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (netlifyResponse.ok) {
      console.log('Order confirmation submitted to Netlify Forms successfully');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Order confirmation submitted successfully',
          method: 'netlify-forms'
        }),
      };
    } else {
      console.error('Netlify Forms submission failed:', netlifyResponse.status);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to submit to Netlify Forms',
          status: netlifyResponse.status
        }),
      };
    }

  } catch (error) {
    console.error('Error sending order confirmation:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send order confirmation', 
        details: error.message 
      }),
    };
  }
};
