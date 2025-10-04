const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
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

    // Get the site URL from the request
    const siteUrl = process.env.URL || 'https://hermestutoring.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${siteUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/services.html`,
      allow_promotion_codes: true, // Enable coupon codes
      billing_address_collection: 'required', // Optional: require billing address
      metadata: {
        order_type: 'tutoring_package',
      },
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
      stripeKey: process.env.STRIPE_SECRET_KEY ? 'Set' : 'Not set'
    });
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to create checkout session', 
        details: error.message 
      }),
    };
  }
};
