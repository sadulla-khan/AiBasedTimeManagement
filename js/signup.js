import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyBXmyGfZB3qD7DX-gdze91aniW9Yc6w_f4",
    authDomain: "aiproductivity-66658.firebaseapp.com",
    databaseURL: "https://aiproductivity-66658-default-rtdb.firebaseio.com",
    projectId: "aiproductivity-66658",
    storageBucket: "aiproductivity-66658.firebasestorage.app",
    messagingSenderId: "297399507249",
    appId: "1:297399507249:web:30839fd377c102a403b810",
    measurementId: "G-960TDPTEF9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById('form');
const messageContainer = document.querySelector('.message-container');
const message = document.getElementById('message');

form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  const email = document.getElementById('email').value;
  const password = document.getElementById('password1').value;
  const confirmPassword = document.getElementById('password2').value;

  // Validate password match
  if (password !== confirmPassword) {
    message.textContent = 'Passwords do not match. Please try again.';
    messageContainer.classList.add('error');
    return; // Exit early if passwords don't match
  }

  // Create a new user with email and password
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    message.textContent = 'Account created successfully!';
    messageContainer.classList.add('success');
    window.location.href = "index.html";

    // Optionally, handle additional logic like storing user data in the database
    // or redirecting to a different page

  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    message.textContent = errorMessage;
    messageContainer.classList.add('error');

    console.error('Error creating user:', errorCode, errorMessage);
  }
});