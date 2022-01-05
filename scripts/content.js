// import introJs from "scripts/intro.min.js";
// import { lessonOptions } from 'scripts/lesson.js';

console.log("Chrome Extension Univerlay Connected");

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "clear") {
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
  noLocalUser()
}

function yesLocalUser() {
  console.log("in the yesLocalUser function")
  let userDetails = {
    "userid": localStorage.getItem('userid')
  };
  start(userDetails)
}

function noLocalUser() {
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.message === "start") {
        let userDetails = {
          "userid": request.userid
      };
        console.log("Submit button worked, start function initiated");
        localStorage.setItem('userid', userDetails.userid);
        start(userDetails);
      };
    }
  );
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
  console.log("Call Rails started, fetching data")
  console.log(localStorage.getItem('lessonid'))
  const url = new URL(`http://localhost:3000/lessons/${localStorage.getItem('lessonid')}/lesson_steps`)
  fetch(url, {
    method: 'GET',
    // credentials: 'include',
    headers: { 'Accept': 'application/json'}
    // ,mode: "no-cors"
  }
    )
    .then(response => response.json())
    .then(data => dataProcessURL(data, userDetails), console.log("fetch worked"));
};

function dataProcessURL(data, userDetails) {
  console.log("in data process function", data[0].pop_up_text)
  console.log(data);
  console.log(location.href);
  const filteredData = data.filter(element => element.url === location.href);
  fetchProgress(filteredData, userDetails);
  // filteredData.forEach( element => addElement(element.pop_up_text)); testing fetchProgress
};

// function addElement(text) { testing fetchProgress
//   // create a new div element
//   console.log("in js addElement")
//   const newDiv = document.createElement("div");
//   newDiv.setAttribute("style", "background-color: rgba(0,0,0,0.5);position: fixed;");
//   // and give it some content
//   const newContent = document.createTextNode(text)

//   // add the text node to the newly created div
//   newDiv.appendChild(newContent);

//   // add the newly created element and its content into the DOM
//   // const currentDiv = document.querySelector(".application-main");
//   const currentDiv = document.querySelector("p");
//   document.body.insertBefore(newDiv, currentDiv[0]);
// }

function fetchProgress(filteredData, userDetails) {
  console.log("Fetching progress")
  const url = new URL(`http://localhost:3000/lessons/${localStorage.getItem('lessonid')}//lesson_progresses`)
  fetch(url, {
    method: 'GET',
    // credentials: 'include',
    headers: { 'Accept': 'application/json' }
    // ,mode: "no-cors"
  }
  )
    .then(response => response.json())
    .then(data => dataProcessUserID(data, filteredData, userDetails), console.log("fetch progress worked"));
};

function startObjectsIntro(inputLesson) {
  let intro = introJs();
  intro.setOptions(inputLesson);
  intro.start().onbeforechange(function () {

      if (intro._currentSinputep == "2") {
          alert("This is step 2")
      } 
  });
}

function dataProcessUserID(progress, filteredData, userDetails) {
  console.log("userid:", userDetails);
  console.log("progress:", progress);
  console.log("filteredData:", filteredData);
  const currentStep = progress.find(element => element.user_id == userDetails.userid);
  const finalData = filteredData.filter(element => element.sequence >= currentStep.current_step);
  console.log("finalData:", finalData)
  const lessonSteps = {
    steps: []
  };
  finalData.forEach(step => {
    lessonSteps.steps.push({
      element: document.querySelector(step.DOM_Id),
      title: step.title,
      intro: step.pop_up_text
    })
  })
  console.log(lessonSteps);
  startObjectsIntro(lessonSteps);
};

