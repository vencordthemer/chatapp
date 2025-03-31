// Import the Firebase modules you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); // Initialize Firestore

// DOM elements
const login = document.getElementById('login');
const signup = document.getElementById('signup');
const googleLogin = document.getElementById('google-login');
const logout = document.getElementById('logout');
const email = document.getElementById('email');
const password = document.getElementById('password');
const authDiv = document.getElementById('auth');
const messagesDiv = document.getElementById('messages');
const form = document.getElementById('form');

// Login event
login.addEventListener('click', () => {
    const emailValue = email.value;
    const passwordValue = password.value;

    signInWithEmailAndPassword(auth, emailValue, passwordValue)
        .then(() => {
            alert('Logged in successfully!');
            authDiv.style.display = 'none';
            messagesDiv.style.display = 'block';
            form.style.display = 'flex';
            logout.style.display = 'block'; // Show the logout button
        })
        .catch((error) => {
            alert(`Login failed: ${error.message}`);
        });
});

// Signup event
signup.addEventListener('click', () => {
    const emailValue = email.value;
    const passwordValue = password.value;

    createUserWithEmailAndPassword(auth, emailValue, passwordValue)
        .then(() => {
            alert('Account created successfully!');
        })
        .catch((error) => {
            alert(`Signup failed: ${error.message}`);
        });
});

// Google login event
googleLogin.addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            alert(`Welcome, ${user.displayName}!`);
            authDiv.style.display = 'none';
            messagesDiv.style.display = 'block';
            form.style.display = 'flex';
            logout.style.display = 'block'; // Show the logout button
        })
        .catch((error) => {
            alert(`Google login failed: ${error.message}`);
        });
});

// Logout event
logout.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            alert('Logged out successfully!');
            authDiv.style.display = 'block';
            messagesDiv.style.display = 'none';
            form.style.display = 'none';
            logout.style.display = 'none'; // Hide the logout button
        })
        .catch((error) => {
            alert(`Logout failed: ${error.message}`);
        });
});

// Prevent form submission and handle the send button
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the page from reloading
    const input = document.getElementById('input');
    const message = input.value;

    if (message.trim() !== '') {
        try {
            // Save the message to Firestore
            await addDoc(collection(db, 'messages'), {
                text: message,
                timestamp: serverTimestamp(), // Add a server timestamp
                senderId: auth.currentUser ? auth.currentUser.uid : 'anonymous', // Get the current user's ID
                senderName: auth.currentUser ? auth.currentUser.displayName || 'Anonymous' : 'Anonymous', // Get the user's display name
            });

            // Clear the input field
            input.value = '';
        } catch (error) {
            alert(`Error saving message: ${error.message}`);
        }
    }
});

// Listen for new messages in Firestore, sorted by timestamp
onSnapshot(
    query(collection(db, 'messages'), orderBy('timestamp', 'asc')), // Order messages by timestamp (ascending)
    (snapshot) => {
        const messagesList = document.getElementById('messages');
        messagesList.innerHTML = ''; // Clear the current list

        snapshot.forEach((doc) => {
            const messageData = doc.data();
            const messageItem = document.createElement('li');
            messageItem.textContent = `${messageData.senderName}: ${messageData.text}`;
            messagesList.appendChild(messageItem);
        });
    }
);
