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
    const { testEmail } = JSON.parse(event.body);
    const email = testEmail || 'test@example.com';

    console.log('Testing customer email with:', email);

    // Test the customer email function
    const testOrderDetails = {
      sessionId: 'test_' + Date.now(),
      amount: 3249.99,
      currency: 'usd',
      customerEmail: email,
      lineItems: [
        {
          description: 'Elite Package - Test Order',
          quantity: 1,
          amount_total: 324999
        }
      ]
    };

    const response = await fetch(`${process.env.URL || 'https://hermestutoring.netlify.app'}/.netlify/functions/send-customer-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        customerName: 'Test Customer',
        orderDetails: testOrderDetails
      }),
    });

    const result = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Customer email test completed',
        emailSent: result.success,
        method: result.method,
        details: result
      }),
    };

  } catch (error) {
    console.error('Error testing customer email:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to test customer email', 
        details: error.message 
      }),
    };
  }
};
