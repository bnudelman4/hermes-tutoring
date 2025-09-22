# Email Setup Guide for Hermes Tutoring

## Current Status
✅ **Email system is set up but needs configuration**
- The webhook function is ready to send emails
- Currently logs emails to Netlify console for manual sending
- Multiple email service options available

## Quick Setup Options

### Option 1: Zapier Webhook (Recommended - Easiest)
1. Go to [Zapier.com](https://zapier.com) and create a free account
2. Create a new Zap with "Webhooks" as trigger
3. Copy the webhook URL
4. In Netlify, go to Site Settings > Environment Variables
5. Add: `EMAIL_WEBHOOK_URL` = your Zapier webhook URL
6. In Zapier, add "Email" action to send the email
7. Deploy and test!

### Option 2: EmailJS (Free Service)
1. Go to [EmailJS.com](https://emailjs.com) and create account
2. Create a new service (Gmail, Outlook, etc.)
3. Create an email template
4. In Netlify Environment Variables, add:
   - `EMAILJS_SERVICE_ID` = your service ID
   - `EMAILJS_TEMPLATE_ID` = your template ID  
   - `EMAILJS_USER_ID` = your user ID
5. Deploy and test!

### Option 3: Manual Email (Current Fallback)
- Emails are logged in Netlify Functions logs
- You can manually send them to customers
- Check Netlify dashboard > Functions > View logs

## Testing the Email System

### Test the Email Function Directly:
```bash
curl -X POST https://hermestutoring.netlify.app/.netlify/functions/send-email-real \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<h1>Test Email</h1><p>This is a test email from Hermes Tutoring.</p>"
  }'
```

### Test via Stripe Webhook:
1. Make a test purchase
2. Check Netlify Functions logs
3. Look for "EMAIL TO SEND MANUALLY" section
4. Copy the email details and send manually

## Email Content Template

The system automatically generates professional emails with:
- ✅ Customer's name and email
- ✅ Order details and items purchased
- ✅ Total amount paid
- ✅ Next steps for the customer
- ✅ Contact information
- ✅ Professional branding

## Current Email Flow

1. **Customer completes payment** → Stripe processes payment
2. **Stripe webhook triggered** → `stripe-webhook.js` runs
3. **Email prepared** → Professional HTML email created
4. **Email sent** → Via configured service (webhook/EmailJS)
5. **Fallback logging** → If no service configured, logs to console

## Troubleshooting

### If emails aren't sending:
1. Check Netlify Functions logs
2. Verify environment variables are set
3. Test the email function directly
4. Check webhook/EmailJS configuration

### If you see "Email logged for manual sending":
- This means no email service is configured
- Set up one of the options above
- Or manually send the logged emails

## Next Steps

1. **Choose an email service** (Zapier recommended)
2. **Set up the service** following the guide above
3. **Add environment variables** in Netlify
4. **Test with a real purchase**
5. **Verify emails are being sent**

The email system is ready - it just needs one of these services configured to start sending real emails automatically!
