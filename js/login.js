import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
  import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';

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
  const analytics = getAnalytics(app);


const messageContainer = document.querySelector('.message-container');
const message = document.getElementById('message');

if(localStorage.getItem("email") != null){
    console.log(localStorage.getItem("email"));
    window.location.href = "home.html";
}


document.getElementById('btn').addEventListener('click', function (e) {
    // Prevent default form submission behavior
    e.preventDefault();
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    //console.log(email);
    const auth = getAuth();
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("success");
    console.log(user.email);
    localStorage.setItem("firebaseUser", JSON.stringify(user));
    localStorage.setItem("email", user.email );
    window.location.href = "home.html";

    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
  });

})
