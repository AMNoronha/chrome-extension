chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received!");
  if (request.cmd === "runLogic") {
    console.log("in background script setting")
    console.log(request)
    chrome.storage.sync.set({ "email": request.email }, function () {
      console.log('Value is set to ' + request.email);
    });
    chrome.storage.sync.set({ "token": request.token }, function () {
      console.log('Value is set to ' + request.token);
    });
    chrome.runtime.sendMessage({ cmd: 'populateLessons' });
  };
  if (request.cmd === "clear") {
    console.log("in background script clearing")
    console.log(request)
    chrome.storage.sync.clear()
  };
});
