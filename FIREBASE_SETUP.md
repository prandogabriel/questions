# 🔥 Firebase Setup Guide - Step by Step

This guide will help you configure Firebase from scratch for the Realtime Q&A project.

## 📋 Table of Contents
1. [Create Firebase Project](#1-create-firebase-project)
2. [Configure Firestore Database](#2-configure-firestore-database)
3. [Configure Authentication](#3-configure-authentication)
4. [Get Credentials](#4-get-credentials)
5. [Configure Environment Variables](#5-configure-environment-variables)
6. [Test the Application](#6-test-the-application)

---

## 1. Create Firebase Project

### Step 1.1: Access Firebase Console
1. Go to: https://console.firebase.google.com/
2. Sign in with your Google account
3. Click the **"Add project"** button

### Step 1.2: Create the Project
1. **Project name**: Type `realtime-qanda` (or your preferred name)
2. Click **"Continue"**
3. **Google Analytics**: You can disable it (not required for this project)
4. Click **"Create project"**
5. Wait for creation (may take a few seconds)
6. Click **"Continue"** when the project is ready

---

## 2. Configure Firestore Database

### Step 2.1: Create the Database
1. In the left sidebar, click **"Firestore Database"** (database icon)
2. Click the **"Create database"** button

### Step 2.2: Choose Security Mode
You will see two options:

**Option 1: Production mode (Recommended for learning)**
- Select **"Start in production mode"**
- This mode will require us to configure security rules manually
- Click **"Next"**

**Option 2: Test mode (Easier, but less secure)**
- Select **"Start in test mode"**
- Allows read/write for 30 days without authentication
- ⚠️ Not recommended for production
- Click **"Next"**

### Step 2.3: Choose Location
1. Select the location closest to you (e.g., `southamerica-east1` for São Paulo)
2. Click **"Enable"**
3. Wait a few seconds while Firestore is created

### Step 2.4: Configure Security Rules (IMPORTANT!)

#### If you chose "Production mode":

1. In the top menu, click the **"Rules"** tab
2. Replace ALL content with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Rules for rooms collection
    match /rooms/{roomId} {
      // Anyone can read rooms
      allow read: if true;

      // Only authenticated users can create rooms
      allow create: if request.auth != null;

      // Only admin can update/delete
      allow update, delete: if request.auth != null &&
                                request.auth.uid == resource.data.adminId;

      // Questions subcollection
      match /questions/{questionId} {
        // Anyone can read questions
        allow read: if true;

        // Authenticated users can create questions
        allow create: if request.auth != null;

        // Authenticated users can update (for voting)
        allow update: if request.auth != null;

        // Only admin can delete questions
        allow delete: if request.auth != null &&
                         get(/databases/$(database)/documents/rooms/$(roomId)).data.adminId == request.auth.uid;
      }
    }
  }
}
```

3. Click **"Publish"**

#### If you chose "Test mode":
- Rules already allow temporary access
- You can add the above rules later for better security

---

## 3. Configure Authentication

### Step 3.1: Access Authentication
1. In the left sidebar, click **"Authentication"** (person icon)
2. Click the **"Get started"** button

### Step 3.2: Enable Anonymous Login
1. You will see a list of **"Sign-in providers"**
2. Look for **"Anonymous"** in the list
3. Click on it
4. Enable the **"Enable"** switch
5. Click **"Save"**

✅ Done! Anonymous authentication is configured.

---

## 4. Get Credentials

### Step 4.1: Register Web App
1. Go back to the project home page (click the home icon 🏠 at the top)
2. In the **"Get started by adding Firebase to your app"** section, click the **Web** icon `</>`
   - If it doesn't appear, click the gear icon ⚙️ > **Project settings** > Scroll to **"Your apps"**
3. A modal will open

### Step 4.2: Register the App
1. **App nickname**: Type `Realtime Q&A Web`
2. Do **NOT** check "Firebase Hosting" option (we won't use it for now)
3. Click **"Register app"**

### Step 4.3: Copy the Credentials
You will see JavaScript code similar to this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijk",
  authDomain: "realtime-qanda.firebaseapp.com",
  projectId: "realtime-qanda",
  storageBucket: "realtime-qanda.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**IMPORTANT**: Copy these values! You will need them in the next step.

4. Click **"Continue to console"**

---

## 5. Configure Environment Variables

### Step 5.1: Open the .env file
In your project, you already have a `.env` file created. Open it in your editor.

### Step 5.2: Fill in the Variables
Using the values you copied from Firebase, fill in the `.env` file:

```bash
# Example - replace with YOUR Firebase values
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijk
VITE_FIREBASE_AUTH_DOMAIN=realtime-qanda.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=realtime-qanda
VITE_FIREBASE_STORAGE_BUCKET=realtime-qanda.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

**Tip**: Make sure that:
- There are no spaces before or after the `=`
- You copied the values correctly (without quotes)
- All 6 variables are filled in

### Step 5.3: Save the File
Save the `.env` file and **restart the development server**:

```bash
# Stop the server (Ctrl + C)
# Start again
npm run dev
```

---

## 6. Test the Application

### Step 6.1: Access the Application
1. Open your browser
2. Go to: http://localhost:5174/ (or the port shown in the terminal)

### Step 6.2: Check if it Worked
If everything is correct, you will see:
- ✅ Home page with two options: "Create Room" and "Join Room"
- ✅ No errors in the browser console (F12)

### Step 6.3: Test Room Creation
1. Click **"Create New Room"**
2. Enter a name (e.g., "Test 123")
3. Click **"Create Room"**
4. You should be redirected to the administrator page
5. You will see a code like `ABC-123` at the top

### Step 6.4: Test as Participant
1. Copy the room code
2. Open a new incognito tab (Ctrl+Shift+N in Chrome)
3. Go to http://localhost:5174/
4. Click **"Join Room"**
5. Paste the code and click **"Join"**
6. You should see the room as a participant

### Step 6.5: Test Questions and Votes
1. In the participant tab, click **"Ask a Question"**
2. Type a question and click **"Submit Question"**
3. Go back to the admin tab
4. You should see the question appear in real-time! 🎉

---

## ✅ Setup Complete!

Congratulations! Your Firebase is configured and working. Now you can:

- Create Q&A rooms
- Participants can ask questions
- Vote on questions
- Administrators can moderate (pin, mark as answered, delete)

## 🚨 Common Issues

### Error: "Firebase configuration missing"
- Check if the `.env` file exists in the project root
- Check if all variables are filled in
- Restart the server (`npm run dev`)

### Error: "Permission denied"
- Check the Firestore security rules
- Make sure anonymous authentication is enabled

### Error creating room or question
- Open the browser console (F12) and see the error message
- Check if anonymous authentication is working
- Check Firestore rules

### Questions don't appear in real-time
- Check your internet connection
- Open the console and see if there are errors
- Try reloading the page

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

If you need help, check the `README.md` file in the project!
