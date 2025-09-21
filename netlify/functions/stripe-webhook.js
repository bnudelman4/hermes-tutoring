const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function sendConfirmationEmail(session) {
  // Simple email using Netlify Forms for now
  // In production, you'd use a service like SendGrid, Mailgun, or AWS SES
  
  const emailData = {
    to: session.customer_details?.email || 'customer@example.com',
    subject: 'Payment Confirmation - Hermes Tutoring LLC',
    html: `
      <h2>Thank you for your purchase!</h2>
      <p>Your payment has been processed successfully.</p>
      
      <h3>Order Details:</h3>
      <p><strong>Session ID:</strong> ${session.id}</p>
      <p><strong>Amount Paid:</strong> $${(session.amount_total / 100).toFixed(2)}</p>
      <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
      
      <h3>Next Steps:</h3>
      <ul>
        <li>Our team will contact you within 24 hours to schedule your first session</li>
        <li>You will receive access to our student portal</li>
        <li>If you have any questions, contact us at alpvargelci@gmail.com</li>
      </ul>
      
      <p>Thank you for choosing Hermes Tutoring LLC!</p>
      <p>Best regards,<br>The Hermes Tutoring Team</p>
    `
  };
  
  console.log('Email would be sent to:', emailData.to);
  console.log('Email content prepared for session:', session.id);
  
  // For now, just log the email. In production, integrate with your email service
  return Promise.resolve();
}

exports.handler = async (event, context) => {
  const sig = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      const session = stripeEvent.data.object;
      console.log('Payment successful:', session.id);
      
      // Send confirmation email
      try {
        await sendConfirmationEmail(session);
        console.log('Confirmation email sent successfully');
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
      break;
    default:
      console.log(`Unhandled event type ${stripeEvent.type}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};
