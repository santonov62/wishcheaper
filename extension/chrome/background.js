
chrome.runtime.onStartup.addListener(function() {

});

function vkAuthListener(ownerTabId, sendResponse) {
  return function checkAuthSuccess(tabId, changeInfo, tab) {
    if (tabId === ownerTabId) {
      console.log(tab);
      if (tab.status === 'complete' && tab.url.indexOf('login') === -1) {
        chrome.tabs.onUpdated.removeListener(checkAuthSuccess);
        sendResponse();
      }
    }
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  chrome.tabs.create({url: 'http://localhost:3000/login', selected: true}, (tab) => {
    chrome.tabs.onUpdated.addListener(vkAuthListener(tab.id));
  });
});
