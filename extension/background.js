
chrome.runtime.onStartup.addListener(function() {
  // vkAuth();
});

function getUrlParameterValue(url, parameterName) {
  "use strict";
  
  var urlParameters  = url.substr(url.indexOf("#") + 1),
      parameterValue = "",
      index,
      temp;
  
  urlParameters = urlParameters.split("&");
  
  for (index = 0; index < urlParameters.length; index += 1) {
    temp = urlParameters[index].split("=");
    
    if (temp[0] === parameterName) {
      return temp[1];
    }
  }
  
  return parameterValue;
}

function listenerHandler(authenticationTabId, resolve, reject) {
  
  return function tabUpdateListener(tabId, changeInfo) {
    var vkAccessToken,
        vkAccessTokenExpiredFlag;
    
    if (tabId === authenticationTabId && changeInfo.url !== undefined && changeInfo.status === "loading") {
      
      if (changeInfo.url.indexOf('oauth.vk.com/blank.html') > -1) {
        authenticationTabId = null;
        chrome.tabs.onUpdated.removeListener(tabUpdateListener);
        
        vkAccessToken = getUrlParameterValue(changeInfo.url, 'access_token');
        
        if (vkAccessToken === undefined || vkAccessToken.length === undefined) {
          displayeAnError('vk auth response problem', 'access_token length = 0 or vkAccessToken == undefined');
          return;
        }
        
        vkAccessTokenExpiredFlag = Number(getUrlParameterValue(changeInfo.url, 'expires_in'));
        
        // if (vkAccessTokenExpiredFlag !== 0) {
        if (vkAccessTokenExpiredFlag < 0) {
          reject('expired');
          displayeAnError('vk auth response problem', 'vkAccessTokenExpiredFlag != 0' + vkAccessToken);
          return;
        }
        
        chrome.storage.local.set({'vkaccess_token': vkAccessToken}, () => {
          chrome.tabs.remove([tabId], () => {
            resolve(vkAccessToken);
            alert('Vk auth successful');
          });
        });
      }
    }
  }
}

function authVk() {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(['authData'], async ({authData}) => {
        
        if (!authData) {
          const token = await getVkAccessToken();
          // const authData = await fetch('https://wishcheaper.herokuapp.com/auth/vk/token', {
          const authData = await fetch('http://localhost:3000/auth/vk/token', {
            method: 'POST',
            body: JSON.stringify({token}),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(response => response.json());
      
          chrome.storage.local.set({authData}, () => {
            resolve(authData);
          });
          
        } else {
          resolve(authData)
        }
      });
      
    } catch (e) {
      reject(e.message);
    }
  })
  
}


function getVkAccessToken() {
  
  return new Promise((resolve, reject) => {
    
    chrome.storage.local.get({'vkaccess_token': {}}, ({vkaccess_token}) => {
  
      if (vkaccess_token.length === undefined) {
        const vkClientId = '7173995';
        const vkAuthenticationUrl = 'https://oauth.vk.com/authorize?client_id=' + vkClientId + '&redirect_uri=http%3A%2F%2Foauth.vk.com%2Fblank.html&display=page&response_type=token';
  
        chrome.tabs.create({url: vkAuthenticationUrl, selected: true}, (tab) => {
          const authenticationTabId = tab.id;
          chrome.tabs.onUpdated.addListener(listenerHandler(authenticationTabId, resolve, reject));
        });
        
      } else {
        resolve(vkaccess_token);
      }
      
    });
  });
  
}

/**
 * Display an alert with an error message, description
 *
 * @param  {string} textToShow  Error message text
 * @param  {string} errorToShow Error to show
 */
function displayeAnError(textToShow, errorToShow) {
  "use strict";
  
  alert(textToShow + '\n' + errorToShow);
}


/**
 * Handler of chrome context menu creation process -creates a new item in the context menu
 */
chrome.contextMenus.create({
  id: "add",
  title: "Bookmark to wishcheaper"
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "add") {
    authVk()
  }
});