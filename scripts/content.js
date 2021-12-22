console.log("Please work");

window.onload = function () {
  callRails();
}

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
}


function callRails() {
  console.log("in call rails")
  const url = new URL("http://localhost:3000/lessons/1/lesson_steps")
  fetch(url, {
    method: 'GET',
    // credentials: 'include',
    headers: { 'Accept': 'application/json'}
    // ,mode: "no-cors"
  }
    )
    .then(response => response.json())
    .then(data => dataProcess(data));
}

function dataProcess(data) {
  console.log(data[0].id)
  // const docUrl = document.url
  data.forEach( element => addElement(element.pop_up_text))
}

function addElement(text) {
  // create a new div element
  console.log("in js addElement")
  const newDiv = document.createElement("div");

  // and give it some content
  const newContent = document.createTextNode(text)

  // add the text node to the newly created div
  newDiv.appendChild(newContent);

  // add the newly created element and its content into the DOM
  const currentDiv = document.querySelector("p");
  document.body.insertBefore(newDiv, currentDiv[0]);
}
