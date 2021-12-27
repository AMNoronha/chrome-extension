function popup() {
  chrome.tabs.query({
    currentWindow: true,
    active: true
  }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      "message": "start",
      "email": document.getElementById("email").value
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("submit-button").addEventListener("click", popup);
  console.log(document.getElementById("email"))
  console.log(document.getElementById("password"))
  console.log(document.getElementById("submit-button"))
});
