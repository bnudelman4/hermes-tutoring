const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
    console.log('Received request body:', event.body);
    
    // Check if Stripe key is available
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    
    const { items } = JSON.parse(event.body);
    console.log('Parsed items:', items);

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('No items provided or items is not an array');
    }

    // Items are already formatted as line items from the frontend
    const lineItems = items;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'klarna', 'us_bank_account'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://hermestutoring.com/success.html',
      cancel_url: 'https://hermestutoring.com/services.html',
      allow_promotion_codes: true, // Enable coupon codes
      billing_address_collection: 'required', // Optional: require billing address
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      stripeKey: process.env.STRIPE_SECRET_KEY ? 'Set' : 'Not set',
      errorType: error.type,
      errorCode: error.code
    });
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to create checkout session', 
        details: error.message,
        type: error.type,
        code: error.code
      }),
    };
  }
};
