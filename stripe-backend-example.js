// Example Node.js/Express backend for Stripe integration
// This is a complete example of how to set up Stripe checkout

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_secret_key_here'); // Replace with your secret key or set STRIPE_SECRET_KEY environment variable
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('.')); // Serve your static files

// Create checkout session endpoint
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      mode: 'payment',
      success_url: `http://localhost:8080/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:8080/services.html`,
      metadata: {
        order_type: 'tutoring_package',
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint to handle successful payments
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = 'whsec_your_webhook_secret_here'; // Replace with your webhook secret

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful:', session);
      
      // Here you would:
      // 1. Save the order to your database
      // 2. Send confirmation email to customer
      // 3. Clear the customer's cart
      // 4. Set up their tutoring sessions
      
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('To use this backend:');
  console.log('1. npm install express stripe cors');
  console.log('2. Replace the Stripe keys with your actual keys');
  console.log('3. Update the frontend STRIPE_PUBLISHABLE_KEY');
  console.log('4. Run: node stripe-backend-example.js');
});
