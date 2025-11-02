#!/bin/bash

# Script to help setup GitHub secrets for Firebase CI/CD
# This script will guide you through adding all required secrets

set -e

echo "════════════════════════════════════════════════════════════"
echo "🔑 GitHub Secrets Setup Helper"
echo "════════════════════════════════════════════════════════════"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "📦 Install it: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ You are not authenticated with GitHub CLI"
    echo "🔐 Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is ready"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found in current directory"
    echo "💡 Make sure you're in the project root and have .env configured"
    exit 1
fi

echo "📋 Found .env file"
echo ""

# Load .env file
export $(cat .env | grep -v '^#' | xargs)

echo "════════════════════════════════════════════════════════════"
echo "Step 1: Setting Firebase Config Secrets from .env"
echo "════════════════════════════════════════════════════════════"
echo ""

# Set secrets from .env
if [ -n "$VITE_FIREBASE_API_KEY" ]; then
    echo "Setting VITE_FIREBASE_API_KEY..."
    gh secret set VITE_FIREBASE_API_KEY --body "$VITE_FIREBASE_API_KEY"
    echo "✅ VITE_FIREBASE_API_KEY set"
else
    echo "❌ VITE_FIREBASE_API_KEY not found in .env"
fi

if [ -n "$VITE_FIREBASE_AUTH_DOMAIN" ]; then
    echo "Setting VITE_FIREBASE_AUTH_DOMAIN..."
    gh secret set VITE_FIREBASE_AUTH_DOMAIN --body "$VITE_FIREBASE_AUTH_DOMAIN"
    echo "✅ VITE_FIREBASE_AUTH_DOMAIN set"
else
    echo "❌ VITE_FIREBASE_AUTH_DOMAIN not found in .env"
fi

if [ -n "$VITE_FIREBASE_PROJECT_ID" ]; then
    echo "Setting VITE_FIREBASE_PROJECT_ID..."
    gh secret set VITE_FIREBASE_PROJECT_ID --body "$VITE_FIREBASE_PROJECT_ID"
    echo "✅ VITE_FIREBASE_PROJECT_ID set"
else
    echo "❌ VITE_FIREBASE_PROJECT_ID not found in .env"
fi

if [ -n "$VITE_FIREBASE_STORAGE_BUCKET" ]; then
    echo "Setting VITE_FIREBASE_STORAGE_BUCKET..."
    gh secret set VITE_FIREBASE_STORAGE_BUCKET --body "$VITE_FIREBASE_STORAGE_BUCKET"
    echo "✅ VITE_FIREBASE_STORAGE_BUCKET set"
else
    echo "❌ VITE_FIREBASE_STORAGE_BUCKET not found in .env"
fi

if [ -n "$VITE_FIREBASE_MESSAGING_SENDER_ID" ]; then
    echo "Setting VITE_FIREBASE_MESSAGING_SENDER_ID..."
    gh secret set VITE_FIREBASE_MESSAGING_SENDER_ID --body "$VITE_FIREBASE_MESSAGING_SENDER_ID"
    echo "✅ VITE_FIREBASE_MESSAGING_SENDER_ID set"
else
    echo "❌ VITE_FIREBASE_MESSAGING_SENDER_ID not found in .env"
fi

if [ -n "$VITE_FIREBASE_APP_ID" ]; then
    echo "Setting VITE_FIREBASE_APP_ID..."
    gh secret set VITE_FIREBASE_APP_ID --body "$VITE_FIREBASE_APP_ID"
    echo "✅ VITE_FIREBASE_APP_ID set"
else
    echo "❌ VITE_FIREBASE_APP_ID not found in .env"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "Step 2: Setting Firebase Service Account"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📝 You need to download the Service Account JSON from Firebase Console:"
echo ""
echo "1. Go to: https://console.firebase.google.com/"
echo "2. Select your project"
echo "3. Settings ⚙️  > Service Accounts"
echo "4. Click 'Generate new private key'"
echo "5. Save the JSON file as 'service-account.json' in this directory"
echo ""
read -p "Press Enter when you have the file ready..."

if [ -f "service-account.json" ]; then
    echo ""
    echo "Setting FIREBASE_SERVICE_ACCOUNT..."
    gh secret set FIREBASE_SERVICE_ACCOUNT < service-account.json
    echo "✅ FIREBASE_SERVICE_ACCOUNT set"
    echo ""
    echo "🗑️  Removing service-account.json for security..."
    rm service-account.json
    echo "✅ File removed"
else
    echo "❌ service-account.json not found"
    echo "⚠️  You'll need to set FIREBASE_SERVICE_ACCOUNT manually:"
    echo "gh secret set FIREBASE_SERVICE_ACCOUNT < path/to/service-account.json"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "Step 3: Setting Firebase Project ID Variable"
echo "════════════════════════════════════════════════════════════"
echo ""

if [ -n "$VITE_FIREBASE_PROJECT_ID" ]; then
    echo "Setting FIREBASE_PROJECT_ID variable..."
    gh variable set FIREBASE_PROJECT_ID --body "$VITE_FIREBASE_PROJECT_ID"
    echo "✅ FIREBASE_PROJECT_ID variable set"
else
    echo "❌ VITE_FIREBASE_PROJECT_ID not found in .env"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Setup Complete!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📋 To verify your secrets:"
echo "   gh secret list"
echo ""
echo "📋 To verify your variables:"
echo "   gh variable list"
echo ""
echo "🚀 Now you can push to main branch and the deploy will work!"
echo "   git push origin main"
echo ""
echo "👀 Monitor the deployment:"
echo "   https://github.com/$(gh repo view --json owner,name -q '.owner.login + \"/\" + .name')/actions"
echo ""
