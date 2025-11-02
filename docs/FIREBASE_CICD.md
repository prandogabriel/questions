# 🚀 Firebase CI/CD Setup - Production Only

This guide explains how to configure automatic deployment to Firebase Hosting via GitHub Actions (production only).

## 📋 Prerequisites

- Configured Firebase project (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))
- GitHub repository
- Firebase CLI installed locally (optional, for testing)

## 🔧 Local Configuration

### 1. Configure Firebase Project ID

Copy the example file:

```bash
cp .firebaserc.example .firebaserc
```

Edit `.firebaserc` with your project ID:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

**⚠️ IMPORTANT**: The `.firebaserc` file is in `.gitignore` and **should NOT be committed** to keep the project public without exposing sensitive data.

### 2. Test Local Build

```bash
npm run build
npm run preview
```

## 🔑 GitHub Configuration

### 1. Firebase Service Account

First, create a Service Account for GitHub Actions to deploy:

1. Access [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (⚙️) > **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file (you'll need it)

### 2. Configure GitHub Secrets

In your GitHub repository, go to:

**Settings** → **Secrets and variables** → **Actions**

#### Variables (public, non-secret):

Click **Variables** and add:

- **Name**: `FIREBASE_PROJECT_ID`
- **Value**: Your Firebase project ID (e.g., `realtime-qanda-12345`)

#### Secrets (private):

Click **Secrets** and add the following secrets:

| Secret Name | Value | Where to find |
|-------------|-------|---------------|
| `VITE_FIREBASE_API_KEY` | Your API Key | Firebase Console > Project Settings > General |
| `VITE_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` | Firebase Console > Project Settings |
| `VITE_FIREBASE_PROJECT_ID` | Project ID | Firebase Console > Project Settings |
| `VITE_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` | Firebase Console > Project Settings |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID (numbers) | Firebase Console > Project Settings |
| `VITE_FIREBASE_APP_ID` | App ID | Firebase Console > Project Settings |
| `FIREBASE_SERVICE_ACCOUNT` | **Entire JSON content** of Service Account | File downloaded in step 1 |

**💡 Tip**: For `FIREBASE_SERVICE_ACCOUNT`, open the JSON file in your editor and copy **ALL the content** (including the braces `{}`).

### 3. Configure GitHub Environment (Optional but Recommended)

To add an extra security layer:

1. Go to **Settings** → **Environments**
2. Click **New environment**
3. Name: `production`
4. Check **Required reviewers** if you want to manually approve deploys
5. Add branch restrictions (only `main`)

## 🔄 How CI/CD Works

### CI Workflow (Continuous Integration)

**File**: `.github/workflows/ci.yml`

**Trigger**:
- Every push to `main` branch
- Every Pull Request to `main`

**What it does**:
- ✅ Checks TypeScript (`npm run typecheck`)
- ✅ Runs linter (`npm run lint`)
- ✅ Checks formatting (`npm run format`)
- ✅ Builds the application
- ✅ Saves build artifacts

### CD Workflow (Continuous Deployment)

**File**: `.github/workflows/cd-production.yml`

**Trigger**:
- Push to `main` branch (after CI passes)
- Manually via **Actions** → **CD - Production** → **Run workflow**

**What it does**:
1. 🏗️ Builds application with production environment variables
2. 🚀 Deploys to Firebase Hosting (`live` channel)
3. ✅ Production URL will be available

## 🧪 Testing the Deploy

### 1. First Deploy

After configuring all secrets:

```bash
git add .
git commit -m "feat: configure Firebase CI/CD"
git push origin main
```

### 2. Monitor the Deploy

1. Go to **Actions** tab on GitHub
2. Watch the **CI** workflow run first
3. If it passes, watch **CD - Production** start
4. Wait for completion (~2-3 minutes)
5. See deploy URL in logs or Firebase Console

### 3. Manual Deploy

If you want to deploy without pushing:

1. Go to **Actions** tab
2. Click **CD - Production**
3. Click **Run workflow**
4. Select `main` branch
5. Click **Run workflow**

## 📊 Monitoring

### Firebase Console

1. Access [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Hosting**
4. See deploy history, domains, and metrics

### GitHub Actions

1. **Actions** tab shows all workflows
2. Click a workflow to see details
3. See logs for each step
4. See execution time and status

## 🔒 Security

- ✅ `.firebaserc` in `.gitignore` (not committed)
- ✅ All credentials in GitHub Secrets (encrypted)
- ✅ Service Account with minimum required permissions
- ✅ Project ID can be a Variable (doesn't need to be secret)
- ✅ Project can be public without exposing sensitive data

## 🛠️ Useful Commands

### Test build locally

```bash
npm run build
npm run preview
```

### Manual deploy with Firebase CLI (optional)

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Select project
firebase use default  # or firebase use your-project-id

# Deploy
firebase deploy --only hosting
```

## 🚨 Troubleshooting

### ❌ Error: "Permission denied" on deploy

**Solution**:
1. Verify Service Account was created correctly
2. In Firebase Console, go to **IAM & Admin**
3. Check if Service Account has **Firebase Hosting Admin** role

### ❌ Build fails with "environment variables missing"

**Solution**:
1. Verify all secrets are configured in GitHub
2. Secret names must be **exactly** as in the table above
3. Values should not have extra spaces at beginning/end

### ❌ Deploy works but site shows error

**Solution**:
1. Verify environment variables are correct
2. Test build locally: `npm run build && npm run preview`
3. Check browser console (F12) for more details

### ❌ Workflow doesn't run

**Solution**:
1. Verify workflow is in correct folder: `.github/workflows/`
2. Check for YAML syntax errors
3. See **Actions** tab for error messages

## 📚 Next Steps

After deploy works:

1. **Custom Domain**: Configure custom domain in Firebase Hosting
2. **Preview Channels**: Use preview channels to test before prod
3. **Analytics**: Set up Firebase Analytics for metrics
4. **Performance**: Enable Firebase Performance Monitoring

## 🔗 Useful Links

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [GitHub Actions Docs](https://docs.github.com/actions)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firebase Action for Hosting](https://github.com/FirebaseExtended/action-hosting-deploy)
