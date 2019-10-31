
chrome.runtime.onStartup.addListener(function() {

});

// chrome.browserAction.onClicked.addListener((tab) => {
//   const tabId = tab.id;
//   chrome.tabs.executeScript(tabId, {
//     file: "modal.js"
//   }, () => {
//
//   });
// });

function vkAuthListener(ownerTabId) {
  return function checkAuthSuccess(tabId, changeInfo, tab) {
    if (tabId === ownerTabId) {
      console.log(`waiting authData...`);
      if (tab.status === 'complete' && tab.url.indexOf('login') === -1) {
        chrome.tabs.onUpdated.removeListener(checkAuthSuccess);
        chrome.tabs.executeScript(tabId, {
          file: "getAuthData.js"
        }, () => {
          console.log('done');
          console.groupEnd();
          chrome.tabs.remove(tabId, () => {});
        });
      }
    }
  }
}

chrome.runtime.onMessage.addListener( ({action, data}) => {
  console.log(`action: ${action}`, data);
  if (action === 'vkAuth') {
    const url = data.url;
    console.group(`[vkAuth]`);
    console.log('chrome.tabs.create ', url);
    chrome.tabs.create({url, selected: true}, (tab) => {
      console.log('done');
      chrome.tabs.onUpdated.addListener(vkAuthListener(tab.id));
    });
  } else if (action === 'authData') {
    console.group(`[authData]`);
    console.log('chrome.storage.local.set', data);
    chrome.storage.local.set({authData: data}, () => {
      console.log('done');
      console.groupEnd();
    });
  }
});
