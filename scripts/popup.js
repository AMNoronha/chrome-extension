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

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("user-button").addEventListener("click", popup);
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("clear-button").addEventListener("click", clear);
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("lesson-button").addEventListener("click", lesson);
});
