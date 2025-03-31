# Project Setup

## Prerequisites
Before you start, make sure you have the following installed:
- [Node.js](https://nodejs.org/) and npm
- [Firebase CLI](https://firebase.google.com/docs/cli)

## Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/vencordthemer/chatapp.git
   cd chatapp
   ```

2. **Install dependencies**
   ```sh
   npm install express firebase-admin firebase
   ```

## Firebase Setup

### 1. Create a Firebase Project
Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.

### 2. Enable Authentication
In the Firebase console:
- Navigate to `Authentication` → `Sign-in method`.
- Enable `Google Sign-In` and `Email/Password` authentication.

### 3. Create a Firestore Database
- Go to `Firestore Database` in the Firebase console.
- add these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read and write access to the "messages" collection for authenticated users
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}

```

- Click `Create database` and set it up in production mode.

### 4. Create a Web App in Firebase
- Navigate to `Project Settings` → `General`.
- Click `Add app` and select `Web`.
- Register the app and copy the Firebase config object.

### 5. Add Firebase Config to `app.js`
Replace the planceholder with the correct detailed in the `app.js` with the config object from Firebase:

```js
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Running the Server

1. **Start the server**
   ```sh
   node server.js
   ```
2. Open your browser and navigate to `http://localhost:3000`.

---

Now your project is set up and running! 🎉

