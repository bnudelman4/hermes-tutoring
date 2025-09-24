const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function sendConfirmationEmail(session) {
  const customerEmail = session.customer_details?.email;
  
  if (!customerEmail) {
    console.log('No customer email found, skipping email send');
    return;
  }

  // Get line items from the session
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  
  let orderDetails = '';
  if (lineItems.data && lineItems.data.length > 0) {
    orderDetails = lineItems.data.map(item => 
      `<li>${item.description} - Quantity: ${item.quantity} - $${(item.amount_total / 100).toFixed(2)}</li>`
    ).join('');
  }

  const emailData = {
    to: customerEmail,
    subject: 'Payment Confirmation - Hermes Tutoring LLC',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5aa0;">Thank you for your purchase!</h2>
        <p>Your payment has been processed successfully.</p>
        
        <h3 style="color: #2c5aa0;">Order Details:</h3>
        <p><strong>Session ID:</strong> ${session.id}</p>
        <p><strong>Amount Paid:</strong> $${(session.amount_total / 100).toFixed(2)}</p>
        <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
        
        ${orderDetails ? `<h4>Items Purchased:</h4><ul>${orderDetails}</ul>` : ''}
        
        <h3 style="color: #2c5aa0;">Next Steps:</h3>
        <ul>
          <li>Our team will contact you within 24 hours to schedule your first session</li>
          <li>You will receive access to our student portal</li>
          <li>If you have any questions, contact us at contact@hermestutoring.com</li>
        </ul>
        
        <p>Thank you for choosing Hermes Tutoring LLC!</p>
        <p>Best regards,<br>The Hermes Tutoring Team</p>
      </div>
    `
  };
  
  console.log('Email prepared for:', emailData.to);
  console.log('Order details:', orderDetails);
  
  // Send order confirmation to site owner (you) via Netlify Forms
  try {
    const orderDetails = {
      sessionId: session.id,
      amount: session.amount_total / 100,
      currency: session.currency,
      customerEmail: session.customer_details?.email,
      lineItems: lineItems.data || []
    };

    const response = await fetch(`${process.env.URL || 'https://hermestutoring.netlify.app'}/.netlify/functions/send-order-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: session.customer_details?.email,
        subject: 'Order Confirmation - Hermes Tutoring LLC',
        customerName: session.customer_details?.name || 'Valued Customer',
        orderDetails: orderDetails
      }),
    });
    
    const result = await response.json();
    console.log('Order confirmation response:', result);
    
    if (result.success) {
      console.log('Order confirmation sent to site owner via Netlify Forms');
    } else {
      console.log('Order confirmation failed:', result.message);
    }
  } catch (emailError) {
    console.error('Failed to send order confirmation:', emailError);
  }

  // Also send customer email (optional - for customer confirmation)
  try {
    const orderDetails = {
      sessionId: session.id,
      amount: session.amount_total / 100,
      currency: session.currency,
      customerEmail: session.customer_details?.email,
      lineItems: lineItems.data || []
    };

    const customerResponse = await fetch(`${process.env.URL || 'https://hermestutoring.netlify.app'}/.netlify/functions/send-customer-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: session.customer_details?.email,
        customerName: session.customer_details?.name || 'Valued Customer',
        orderDetails: orderDetails
      }),
    });
    
    const customerResult = await customerResponse.json();
    console.log('Customer email response:', customerResult);
    
    if (customerResult.success) {
      console.log('Customer email sent successfully via:', customerResult.method);
    } else {
      console.log('Customer email failed:', customerResult.message);
    }
  } catch (customerEmailError) {
    console.error('Failed to send customer email:', customerEmailError);
  }
  
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
