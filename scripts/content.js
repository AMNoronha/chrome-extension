// import introJs from "scripts/intro.min.js";
// import { lessonOptions } from 'scripts/lesson.js';

console.log("Chrome Extension Univerlay Connected");

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "clear") {
      console.log("hello from clear")
      localStorage.clear();
      location.reload();
    };
  }
);

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "lessonchange") {
      let lessonDetails = {
        "lessonid": request.lessonid
      };
      localStorage.setItem('lessonid', lessonDetails.lessonid);
      location.reload();
    };
  }
);

let s = document.createElement('script');
// console.log(s);
s.src = chrome.runtime.getURL('scripts/intro.min.js');
// console.log(s.src);
s.onload = function(){
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

if (localStorage.getItem('userid')) {
  console.log("yes local storage userid")
  yesLocalUser();
} else {
  console.log("no local storage userid")
  noLocalUser();
}

function yesLocalUser() {
  console.log("in the yesLocalUser function")
  let userDetails = {
    "userid": localStorage.getItem('userid'),
    "token": localStorage.getItem('token'),
    "email": localStorage.getItem('email')
  };
  start(userDetails)
}

function noLocalUser() {
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.message === "start") {
        let userDetails = {
          "email": request.email,
          "password": request.password
      };
        console.log("Submit button worked, start function initiated");
        fetchAuthToken(userDetails)
        // start(userDetails); commented out to be added after of fetchAuthToken
      };
    }
  );
}

function fetchAuthToken(userDetails) {
  const emailFinal = userDetails.email.replace(/'/g, '"');
  const passwordFinal = userDetails.password.replace(/'/g, '"');
  console.log(emailFinal)
  console.log(passwordFinal)
  const jsonDetails = JSON.stringify({ "user": { "email": emailFinal, "password": passwordFinal } })

  const url = new URL(`http://localhost:3000/users/sign_in`)
  // const url = new URL(`https://www.univerlay.me/users/sign_in`)
  console.log("url", url);
  fetch(url, {
    method: 'POST',
    // credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: jsonDetails,
    // ,mode: "no-cors"
  })
    .then(response => response.json())
    .then(data => authTokenConverter(data));
}

function authTokenConverter(data) {
  let userDetails = {
    "userid": data.id,
    "token": data.auth_token,
    "email": data.email
  };
  localStorage.setItem('userid', data.id);
  localStorage.setItem('token', data.auth_token);
  localStorage.setItem('email', data.email);
  start(userDetails);
}

function start(userDetails) {
  console.log("Start function working, submitted user details:")
  console.log(userDetails);
  callRails(userDetails);
};

function addElement() {
  // create a new div element
  console.log("in js addElement")
  const newDiv = document.createElement("div");

  // and give it some content
  const newContent = document.createTextNode("Tally Ho")

  // add the text node to the newly created div
  newDiv.appendChild(newContent);

  // add the newly created element and its content into the DOM
  const currentDiv = document.querySelector("p");
  document.body.insertBefore(newDiv, currentDiv[0]);
};


function callRails(userDetails) {
  console.log("Call Rails Started, Fetching Data Now")
  console.log("localstorage lessonid:", localStorage.getItem('lessonid'))
  if (localStorage.getItem('lessonid') !== null) {
    const url = new URL(`http://localhost:3000/lessons/${localStorage.getItem(`lessonid`)}/lesson_steps`)
    // const url = new URL(`https://www.univerlay.me/lessons/${localStorage.getItem(`lessonid`)}/lesson_steps`)
    console.log("url", url)
    fetch(url, {
      method: 'GET',
      // credentials: 'include',
      headers: { 'Accept': 'application/json'}
      // ,mode: "no-cors"
    }
      )
      .then(response => response.json())
      .then(data => dataProcessURL(data, userDetails), console.log("fetch worked"));
  }
};

function dataProcessURL(data, userDetails) {
  console.log("in data process function");
  console.log(data);
  console.log(location.href);
  // need to use regex
  const filteredData = data.filter(element => location.href.match(new RegExp(element.url)));
  // const filteredData = data.filter(element => location.href === element.url);
  console.log("data has been filtered to:", filteredData)
  fetchProgress(filteredData, userDetails);
};

function fetchProgress(filteredData, userDetails) {
  console.log("Fetching progress")
  const url = new URL(`http://localhost:3000/lessons/${localStorage.getItem(`lessonid`)}/lesson_progresses`)
  // const url = new URL(`https://www.univerlay.me/lessons/${localStorage.getItem(`lessonid`)}/lesson_progresses`)
  console.log("url", url);
  fetch(url, {
    method: 'GET',
    // credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'X-User-Token': userDetails.token,
      'X-User-Email': userDetails.email
    }
    // ,mode: "no-cors"
  }
  )
    .then(response => response.json())
    .then(data => dataProcessUserID(data, filteredData, userDetails), console.log("fetch progress worked"));
};

// Function to save most updated lesson step into databse
function saveProgress(filteredData, userDetails) {
  console.log("Saving progress");
  const url = new URL(`https://www.univerlay.me/lessons/${localStorage.getItem(`lessonid`)}/lesson_progresses`);
  console.group("url", url);
  fetch(url, {
    method: 'PATCH',
    headers: {'Accept': 'application/json' }
  }
  )
    .then(response => response.json())
    .then(data => dataProcessUserID(data, filteredData, userDetails),
    console.log("Saved progress worked")
  );
};


function dataProcessUserID(progress, filteredData, userDetails) {
  console.log("userid:", userDetails);
  console.log("progress:", progress);
  console.log("filteredData:", filteredData);
  const currentStep = progress.find(element => element.user_id == userDetails.userid);
  const finalData = filteredData.filter(element => element.sequence >= currentStep.current_step);
  console.log("finalData:", finalData)
  appendPopUpToDOM(finalData)
};

// Function to call intro.js but also callback to save lesson progress back to lessons_progresses
function startObjectsIntro(inputLessons) {
  let intro = introJs();
  let lastStep = 0;
  intro.setOptions(inputLessons);
  intro.start().onchange(function () {
    lastStep = intro._currentStep;
    // alert("This is step" + lastStep);
    console.log(lastStep);
  });
}

// Function to create lesson steps from database and then run intro.js
function appendPopUpToDOM(finalData) {
  const lessonOptions = {
    steps: []
  };
  finalData.forEach(step => {
    lessonOptions.steps.push({
      element: document.querySelector(step.DOM_Id),
      title: step.title,
      intro: step.pop_up_text
    })
    console.log("completed step creation for:", step.title)
  })
  console.log(lessonOptions);
  startObjectsIntro(lessonOptions);
}
