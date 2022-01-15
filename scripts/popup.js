console.log("i am in popupjs")

function popup() {
  chrome.tabs.query({
    currentWindow: true,
    active: true
  }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      "message": "start",
      "email": document.getElementById("email").value,
      "password": document.getElementById("password").value
    });
  });
}

function clear() {
  chrome.tabs.query({
    currentWindow: true,
    active: true
  }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      "message": "clear"
    });
  });
}

function lesson() {
  chrome.tabs.query({
    currentWindow: true,
    active: true
  }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      "message": "lessonchange",
      "lessonid": document.getElementById("lessonid").value
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message populateLessons received!");
  if (request.cmd === "populateLessons") {
    fetchLesson();
  };
});

function fetchLesson() {
  let userDetails = {
  };
  // need to add ability to pull from storage and save
  promise1 = new Promise((resolve) => {
    chrome.storage.sync.get('email', result => {
      resolve(result)
    })
  })
  promise2 = new Promise((resolve) => {
    chrome.storage.sync.get('token', result => {
      resolve(result)
    })
  })
  Promise.all([promise1, promise2]).then((values) => {
    console.log("resolved promises:", values)
    userDetails["email"] = values[0]["email"];
    userDetails["token"] = values[1]["token"];
    console.log("email in values:", values[0]["email"])
    console.log("token in values:", values[1]["token"])
    console.log(userDetails)
    // const url = new URL(`http://localhost:3000/api/lessons`)
    const url = new URL(`https://www.univerlay.me/api/lessons`)
    fetch(url, {
      method: 'GET',
      // credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-User-Token': userDetails["token"],
        'X-User-Email': userDetails["email"]
      }
      // ,mode: "no-cors"
    }
    )
      .then(response => response.json())
      .then(data => addLessons(data));
  })

  // chrome.storage.sync.get(["email"]).then((result) => {
  //   userDetails["email"] = result["email"];
  // });
  // chrome.storage.sync.get(["token"]).then((result) => {
  //   userDetails["token"] = result["token"];
  // });
  // console.log("userDetails", userDetails)
  // console.log("token", userDetails["token"]);
  // console.log("email", userDetails["email"]);
}

function addLessons(data) {
  var select = document.getElementById("lessonid")
  console.log(data)
  for (i = 0; i < data.length; i++) {
    var option = document.createElement("option");
    option.value = `${i+1}`;
    option.text = `${data[i].title}`
    console.log(option)
    select.appendChild(option);
  }
}

// section of code is supposed to trigger if chrome storage is persistant and populate drop down
// const test = chrome.storage.sync.get(["email"], function (result) {
//   return result["email"];
// });

promise1 = new Promise((resolve) => {
  chrome.storage.sync.get('email', result => {
    resolve(result)
  })
})
promise2 = new Promise((resolve) => {
  chrome.storage.sync.get('token', result => {
    resolve(result)
  })
})
Promise.all([promise1, promise2]).then((values) => {
  console.log("myvalueshere", values)
  console.log("email in values:", values[0]["email"])
  console.log("token in values:", values[1]["token"])
  if (values[1]["token"]) {
    console.log("hello from background promise option updater")
    fetchLesson();
  }
})

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("user-button").addEventListener("click", popup);
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("clear-button").addEventListener("click", clear);
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("lesson-button").addEventListener("click", lesson);
});
