console.log("Chrome Extension Univerlay Connected");

// Listener for popup submit button (runs chrome extension on page)
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "start") {
      let userDetails = {
        "userid": request.userid
    };
      console.log("Submit button worked, start function initiated");
      start(userDetails);
    };
  }
);

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
  const url = new URL("http://localhost:3000/lessons/1/lesson_steps")
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
  const url = new URL("http://localhost:3000/lessons/1/lesson_progresses")
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

function dataProcessUserID(progress, filteredData, userDetails) {
  console.log("userid:", userDetails);
  console.log("progress:", progress);
  console.log("filteredData:", filteredData);
  const currentStep = progress.find(element => element.user_id == userDetails.userid);
  const finalData = filteredData.filter(element => element.sequence >= currentStep.current_step);
  console.log("finalData:", finalData)
};
