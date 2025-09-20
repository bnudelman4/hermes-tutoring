#!/bin/bash

# Aegis Tutoring Website Deployment Script
echo "🚀 Deploying Aegis Tutoring Website to Netlify..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Please install it first:"
    echo "   npm install -g netlify-cli"
    exit 1
fi

# Deploy to Netlify
echo "📦 Deploying to Netlify..."
netlify deploy --prod --dir .

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your website is now live on Netlify"
    echo "📧 Don't forget to configure form notifications in your Netlify dashboard"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi
