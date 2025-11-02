# Realtime Q&A

Real-time question and answer application, inspired by Slido. Allows administrators to create Q&A rooms and participants to submit questions and vote on the most relevant ones, all in real-time.

## Features

### Administrator
- ✅ Create Q&A room with unique code
- ✅ View questions in real-time
- ✅ Pin important questions
- ✅ Mark questions as answered
- ✅ Delete questions (spam, duplicates)

### Participant
- ✅ Join room with code
- ✅ Submit questions (anonymously or with name)
- ✅ Vote on questions
- ✅ Remove vote
- ✅ View questions sorted by votes

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Firebase (Firestore + Auth)
- **Routing**: React Router v7
- **Build**: Vite

## Firebase Configuration

### 1. Create Firebase Project

1. Access [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name your project (e.g., "realtime-qanda")
4. Follow the creation steps

### 2. Configure Firestore

1. In the sidebar, go to **Firestore Database**
2. Click "Create database"
3. Choose **"Production"** or **"Test"** mode (recommended for development)
4. Choose a region close to you

#### Firestore Security Rules

Configure the rules in **Firestore Database > Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Rooms collection
    match /rooms/{roomId} {
      // Anyone can read rooms
      allow read: if true;

      // Only authenticated users can create rooms
      allow create: if request.auth != null;

      // Only admin can update/delete
      allow update, delete: if request.auth.uid == resource.data.adminId;

      // Questions subcollection
      match /questions/{questionId} {
        // Anyone can read questions
        allow read: if true;

        // Authenticated users can create questions
        allow create: if request.auth != null;

        // Users can update questions (for voting)
        allow update: if request.auth != null;

        // Only admin can delete questions
        allow delete: if request.auth != null &&
          get(/databases/$(database)/documents/rooms/$(roomId)).data.adminId == request.auth.uid;
      }
    }
  }
}
```

### 3. Configure Authentication

1. In the sidebar, go to **Authentication**
2. Click "Get started"
3. In the **Sign-in method** tab, enable:
   - **Anonymous** - activate this provider

### 4. Get Credentials

1. In the sidebar, go to **Project settings** (gear icon)
2. Scroll to **Your apps** and click the **Web** icon (`</>`)
3. Register the app (e.g., "Realtime Q&A Web")
4. Copy the `firebaseConfig` credentials

### 5. Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in the variables with your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## Installation and Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   └── ui/           # UI components (Button, Input, Card, etc)
├── contexts/
│   └── AuthContext.tsx   # Authentication context
├── hooks/
│   ├── useRoom.ts        # Hook to manage rooms
│   └── useQuestions.ts   # Hook to manage questions
├── lib/
│   ├── firebase.ts       # Firebase configuration
│   └── utils.ts          # Utility functions
├── pages/
│   ├── Home.tsx          # Home page
│   ├── CreateRoom.tsx    # Create room (admin)
│   ├── AdminRoom.tsx     # Manage room (admin)
│   └── ParticipantRoom.tsx # Join room (participant)
├── types/
│   └── index.ts          # TypeScript types
└── App.tsx               # Main routes
```

## Data Model (Firestore)

### Collection: `rooms/{roomId}`
```typescript
{
  roomName: string         // Room name
  adminId: string          // Creator UID
  createdAt: string        // ISO timestamp
}
```

### Subcollection: `rooms/{roomId}/questions/{questionId}`
```typescript
{
  text: string             // Question text
  author: string           // Name or "Anonymous"
  votes: number            // Number of votes
  votedBy: string[]        // Array of UIDs who voted
  isPinned: boolean        // Pinned by admin
  isAnswered: boolean      // Marked as answered
  createdAt: string        // ISO timestamp
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Check TypeScript types
- `npm run lint` - Check code with Biome
- `npm run lint:fix` - Fix lint issues
- `npm run format` - Check formatting
- `npm run format:fix` - Fix formatting

## Deploy

The project can be easily deployed to:

- **Firebase Hosting** (recommended)
- **Vercel**
- **Netlify**

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Build
npm run build

# Deploy
firebase deploy
```

## License

MIT
