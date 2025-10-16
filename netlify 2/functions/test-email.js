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

    console.log('Testing email system with:', email);

    // Test the email function
    const testEmailData = {
      to: email,
      subject: 'Hermes Tutoring - Email System Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c5aa0;">Email System Test - Hermes Tutoring</h2>
          <p>This is a test email to verify the email system is working correctly.</p>
          
          <h3 style="color: #2c5aa0;">Test Details:</h3>
          <ul>
            <li><strong>Test Time:</strong> ${new Date().toLocaleString()}</li>
            <li><strong>System Status:</strong> ✅ Working</li>
            <li><strong>Email Service:</strong> Configured</li>
          </ul>
          
          <p>If you received this email, the email confirmation system is working properly!</p>
          
          <p>Best regards,<br>The Hermes Tutoring Team</p>
        </div>
      `,
      orderDetails: {
        test: true,
        timestamp: new Date().toISOString()
      }
    };

    // Call the email function
    const response = await fetch(`${process.env.URL || 'https://hermestutoring.netlify.app'}/.netlify/functions/send-email-real`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEmailData),
    });

    const result = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Email test completed',
        emailSent: result.success,
        method: result.method,
        details: result
      }),
    };

  } catch (error) {
    console.error('Error testing email:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to test email', 
        details: error.message 
      }),
    };
  }
};
