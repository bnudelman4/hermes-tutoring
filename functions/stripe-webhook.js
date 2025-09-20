const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  const sig = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      const session = stripeEvent.data.object;
      console.log('Payment successful:', session);
      
      // Here you would:
      // 1. Save the order to your database
      // 2. Send confirmation email to customer
      // 3. Set up their tutoring sessions
      
      // For now, just log the successful payment
      console.log(`Payment completed for session: ${session.id}`);
      console.log(`Amount: $${session.amount_total / 100}`);
      console.log(`Customer email: ${session.customer_details?.email}`);
      
      break;
    default:
      console.log(`Unhandled event type ${stripeEvent.type}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};
