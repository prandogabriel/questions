# Setup Scripts

## 🔑 setup-github-secrets.sh

Automates the setup of GitHub secrets for Firebase CI/CD.

### What it does:

1. **Reads your `.env` file** and automatically sets these secrets:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

2. **Guides you** to set the Service Account:
   - `FIREBASE_SERVICE_ACCOUNT`

3. **Sets the Project ID variable**:
   - `FIREBASE_PROJECT_ID`

### Usage:

```bash
# Make sure you're in the project root with a configured .env file
cd /path/to/project

# Run the script
./scripts/setup-github-secrets.sh
```

### Requirements:

- ✅ GitHub CLI (`gh`) installed and authenticated
- ✅ `.env` file configured with Firebase credentials
- ✅ Firebase Service Account JSON (download during script execution)

### Manual Setup Alternative:

If you prefer to set secrets manually:

```bash
# Set each secret individually
gh secret set VITE_FIREBASE_API_KEY --body "your-api-key"
gh secret set VITE_FIREBASE_AUTH_DOMAIN --body "your-domain.firebaseapp.com"
gh secret set VITE_FIREBASE_PROJECT_ID --body "your-project-id"
gh secret set VITE_FIREBASE_STORAGE_BUCKET --body "your-bucket.appspot.com"
gh secret set VITE_FIREBASE_MESSAGING_SENDER_ID --body "123456789"
gh secret set VITE_FIREBASE_APP_ID --body "1:123:web:abc"

# Set service account (JSON file)
gh secret set FIREBASE_SERVICE_ACCOUNT < service-account.json

# Set variable
gh variable set FIREBASE_PROJECT_ID --body "your-project-id"
```

### Verification:

```bash
# List all secrets
gh secret list

# List all variables
gh variable list
```

## 🔒 Security Notes

- The script will automatically delete the `service-account.json` file after setting the secret
- Never commit `service-account.json` or `.env` files to git
- All secrets are encrypted by GitHub
