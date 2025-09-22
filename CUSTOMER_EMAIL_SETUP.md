# Customer Email Setup Guide

## Current Status
✅ **Email system is working** - Forms are being submitted
❌ **Emails not reaching customers** - Need to configure email delivery

## The Issue
Netlify Forms by default only sends form submissions to the site owner (you), not to customers. We need to set up a system that actually sends emails to customers.

## Quick Solution: Zapier Webhook (5 minutes)

### Step 1: Create Zapier Webhook
1. Go to [Zapier.com](https://zapier.com) and create a free account
2. Click "Create Zap"
3. Choose "Webhooks" as trigger
4. Select "Catch Hook" 
5. Copy the webhook URL (looks like: `https://hooks.zapier.com/hooks/catch/...`)

### Step 2: Configure Netlify
1. Go to your Netlify dashboard
2. Navigate to Site Settings → Environment Variables
3. Add new variable:
   - **Key**: `EMAIL_WEBHOOK_URL`
   - **Value**: Your Zapier webhook URL
4. Save the changes

### Step 3: Set Up Email Action in Zapier
1. In your Zap, add "Email" as the action
2. Choose your email service (Gmail, Outlook, etc.)
3. Configure the email:
   - **To**: `{{to}}` (from webhook data)
   - **Subject**: `{{subject}}` (from webhook data)
   - **Body**: `{{html}}` (from webhook data)
4. Test and turn on the Zap

### Step 4: Test
1. Go to `https://hermestutoring.netlify.app/test-email.html`
2. Click "Test Customer Email (Recommended)"
3. Check if email arrives

## Alternative: Manual Email (Current Fallback)

If you don't want to set up Zapier right now:

1. **Check Netlify Logs**:
   - Go to Netlify dashboard → Functions
   - Look for "CUSTOMER EMAIL TO SEND" in logs
   - Copy the email content

2. **Send Manually**:
   - Use the HTML content from logs
   - Send to customer's email address
   - Use "Order Confirmation - Hermes Tutoring LLC" as subject

## What the Customer Email Includes

The system generates professional emails with:
- ✅ **Customer's name** (from Stripe checkout)
- ✅ **Order ID** (Stripe session ID)
- ✅ **Order total** (with proper decimal formatting)
- ✅ **Items purchased** (detailed list)
- ✅ **Order date** (when purchased)
- ✅ **Next steps** (scheduling, portal access)
- ✅ **Professional branding** (Hermes Tutoring colors/logo)
- ✅ **Contact information** (your email and phone)

## Testing the System

### Test Page
Visit: `https://hermestutoring.netlify.app/test-email.html`

### Test Functions
- **Test Customer Email (Recommended)** - Tests the actual customer email system
- **Test Netlify Forms** - Tests the form submission system
- **Test Email (Old Method)** - Tests the original email system

### Manual Test
```bash
curl -X POST https://hermestutoring.netlify.app/.netlify/functions/test-customer-email \
  -H "Content-Type: application/json" \
  -d '{"testEmail": "your-email@example.com"}'
```

## Current Email Flow

1. **Customer completes payment** → Stripe processes payment
2. **Stripe webhook triggered** → `stripe-webhook.js` runs
3. **Customer email prepared** → Professional HTML email created
4. **Email sent** → Via Zapier webhook (if configured)
5. **Fallback logging** → If no webhook, logs to console

## Troubleshooting

### If emails aren't sending:
1. Check Netlify Functions logs for "CUSTOMER EMAIL TO SEND"
2. Verify `EMAIL_WEBHOOK_URL` environment variable is set
3. Test the webhook in Zapier
4. Check Zapier logs for errors

### If you see "Email logged for manual sending":
- This means no webhook is configured
- Set up Zapier webhook as described above
- Or manually send the logged emails

## Next Steps

1. **Set up Zapier webhook** (recommended)
2. **Test with the test page**
3. **Make a real purchase** to verify
4. **Check customer receives email**

The email system is ready - it just needs the webhook configured to start sending real emails to customers!
