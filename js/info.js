const sideMenu = document.querySelector("aside");
const themeToggler = document.querySelector(".theme-toggler");
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
const email = localStorage.getItem("email");
console.log(email);
const dashemail= email.replace(".","_");
const today = new Date();
let formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
const askAi = document.getElementById("askAi");
const updates = document.getElementById('updates');
let conversationHistory = [];
let sessionId = crypto.randomUUID();
let schedule = null;

// Set the value of the date input
const dateInput = document.getElementById('dateInput');


// Your Firebase configuration
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
const db = getDatabase(app);

//functions------------------------------------------------------------------------


function writeData(path, data) {
    const dbRef = ref(db, path); // Locate the path
    set(dbRef, data) // Write the data
      .then(() => {
        console.log("Data saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  }
  

function readData(path) {
    const dbRef = ref(db);
    return get(child(dbRef, path))  // Returning the promise
      .then((snapshot) => {
        if (snapshot.exists()) {
          //console.log("Data retrieved:", snapshot.val());
          return snapshot.val();  // Return the data when it's ready
        } else {
          console.log("No data available at this path.");
          return null;
        }
      })
      .catch((error) => {
        console.error("Error reading data:", error);
        throw error;  // Reject the promise if there's an error
      });
  }

  // Function to dynamically add a task
function addTask(title, startTime, endTime) {
    // Create a new div element for the task box
    const taskBox = document.createElement('div');
    taskBox.classList.add('task-box'); // Add class for styling

    // Create a title for the task
    const taskTitle = document.createElement('div');
    taskTitle.classList.add('task-title');
    taskTitle.textContent = title; // Set the task title (you can modify it dynamically later)

    // Create a time div for the start and end times
    const taskTime = document.createElement('div');
    taskTime.classList.add('task-time');
    taskTime.textContent = startTime +" - "+ endTime; // Example times (you can modify it dynamically later)

    // Append title and time to the task box
    taskBox.appendChild(taskTitle);
    taskBox.appendChild(taskTime);

    // Append the task box to the task container
    const taskContainer = document.querySelector('.task-container');
    taskContainer.appendChild(taskBox);
}

// Send the request to Gemini API
async function generate(prompt) {
  if (prompt.trim() === "") {
      alert("Please enter a valid text");
      return;
  }

  // ***UNCOMMENT THIS LINE*** - This is the most important fix
  conversationHistory.push({ "role": "user", "parts": [{ "text": prompt }] });
  console.log("Conversation History Sent to Server:", conversationHistory);

  try {
      const response = await fetch('http://127.0.0.1:5000/generate', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: prompt, session_id: sessionId }),
      });

      if (!response.ok) {
          let errorText = `HTTP error ${response.status}`;
          try {
              const errorData = await response.json();
              if (errorData && errorData.error) {
                  errorText = errorData.error;
              } else if (errorData && errorData.detail) {
                  errorText = errorData.detail;
              }
          } catch (jsonError) {
              console.error("Could not parse JSON error:", jsonError);
              try{
                  errorText = await response.text();// try to get text of non-JSON errors
                  console.error("Raw error response:", errorText);
              }
              catch(textError){
                  console.error("Could not parse text error:", textError);
              }
          }
          throw new Error(errorText);
      }

      const data = await response.json();
      const generatedText = data.text;
      console.log("Response from Gemini:", generatedText);

      conversationHistory = data.history; // Update conversation history from the backend

      return generatedText;
  } catch (error) {
      console.error("Error in generate function:", error);
      //document.getElementById('output').textContent = `Error: ${error.message}`;
  }
}
function toggleInput() {
  const inputContainer = document.getElementById("inputContainer");
  inputContainer.classList.toggle("hidden");
}
function toggleAskai(){
  const askAiContainer = document.getElementById("askAi");
  askAiContainer.classList.toggle("hidden");
}

function addBox(response) {
  const message = response; // Get message from user
  if (message !== null) { // Check if the user clicked "OK" (not "Cancel")
      const newBox = document.createElement('div');
      newBox.classList.add('update');
      newBox.textContent = message;

      updates.appendChild(newBox);
  }
}

//end of functions-------------------------------------------------------------------------------------------------------

//event listeners--------------------------------------------------------------------------------------------------------



//change theme
themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables');

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
})


document.getElementById("send-button").addEventListener('click', () => {
  
 let input= document.getElementById("text-field").value;
 addBox(input);
 document.getElementById("text-field").value =" ";
 generate(input).then((data) => {
  let response= data.trim();
     if(response[0] == "="){
         console.log(data);
         toggleInput();
         toggleAskai();
         updates.innerHTML=" ";
         schedule= data;
         const path="users/" + dashemail + "/common_tasks/";
         writeData(path, schedule);
         const taskContainer = document.querySelector('.task-container');
         taskContainer.innerHTML = " ";
         let schedulearr = schedule.split("=");
schedulearr.forEach((item, index) => {
  console.log(item);
  let taskarr= item.split("-");
  let title= taskarr[0];
  let startTime= taskarr[1];
  let endTime= taskarr[2];
  addTask(title,startTime,endTime);
});

     }else{
      addBox(response);
      updates.scrollTop = updates.scrollHeight;
     }
 })
})

//end od event listeners-----------------------------------------------------------------------------
//code starts from here------------------------------------------------------------------------------------
toggleAskai();

generate("here is a demo task list =Wake up-7:00am-7:00am=Attend university-8:00am-12:00pm=First tution-3:00pm-4:00pm=Second tution-5:00pm-6:00pm=Sleep-11:00pm-11:00pm= the list starts and ends with = . the tasks are separated by =. each tasks has tree informations  separated by -. the first information is task title, second is start time. third is end time. now you have to create a new list just like this. you have to ask the user to add new tasks. you can start by asking when do you wake up. and then carry on. if you are unsure about what the user wants you can ask questions. once you are confident show the task list to the user in a human manner. like this 1. wake up 7am-7am 2. attend university 10am-1pm . ask the user to conform the list. if the user conforms ask the user to add the next tasks. in the list you must maintain serial by the start time of the task. if the user asks to add  a task that collides with a new task ask the user if any of the tasks can be delayed. the user must add at least three tasks. after the user adds at least three tasks as him if he want to add more tasks or if he wants to continue. if the user wants to continue. show the final list to the user again and ask him to confirm. now if the user doesnt confirm and wants to make changes proceed with than but if the user confirms now you have to provide the final list in the form of the demo list mention before. the list must start and end with a =. each task must be separated by =. and the three informations of a taks must be separated by -. when you provide the list dont add any other words except the list itself. the list must start with a =.remember again when you provide the final list the whole response should have only the final list.starting with a =. now start the process by informing the user that they have to add at least three tasks and when do they wake up").then((data) => {
addBox(data.trim());
   
 
})

  const form = document.getElementById('infoForm');
  const errorMessage = document.getElementById('error-message');

  form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent page refresh

      const name = document.getElementById('name').value;
      const age = document.getElementById('age').value;
      const country = document.getElementById('country').value;

      if (isNaN(age) || age < 0 || age >150) {
          errorMessage.textContent = "Please enter a valid age.";
          return; // Stop form submission
      } else {
        if(schedule == null){
          errorMessage.textContent = "add at least three tasks"; // Clear any previous error messages
        }else{
            errorMessage.textContent = "";
            console.log("Name:", name);
            console.log("Age:", age);
            console.log("Country:", country);
            let path="users/"+dashemail+"/info/name";
            writeData(path,name);
            path ="users/"+dashemail+"/info/age";
            writeData(path,age);
            path ="users/"+dashemail+"/info/country";
            writeData(path,country);
            window.location.href="home.html";

con
        }
      }

      // Here you would typically send the data to a server or process it in some way
    

  });


 /* try {
    askAi("hello");
    //handleAiResponse(aiResponse);
} catch (error) {
    console.error("Error:", error);
    alert("Error: Try again!");
}*/