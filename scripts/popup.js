function popup() {
  chrome.tabs.query({
    currentWindow: true,
    active: true
  }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      "message": "start",
      "userid": document.getElementById("userid").value
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("submit-button").addEventListener("click", popup);
});
