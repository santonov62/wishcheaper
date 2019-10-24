
chrome.runtime.onStartup.addListener(function() {

});

// const DOMAIN = `https://wishcheaper.herokuapp.com`;
const DOMAIN = `http://localhost:3000`;

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
        
        if (vkAccessTokenExpiredFlag < 0) {
          reject('expired');
          displayeAnError('vk auth response problem', 'vkAccessTokenExpiredFlag != 0' + vkAccessToken);
          return;
        }
        
        chrome.storage.local.set({'vkaccess_token': vkAccessToken}, () => {
          chrome.tabs.remove([tabId], () => {
            resolve(vkAccessToken);
            alert(`Vk token: ${vkAccessToken}`);
          });
        });
      }
    }
  }
}

async function addUrl(url) {
  try {
    const authData = await authVk();
    if (!authData)
      throw new Error(`authData required`);
    
    const good = await fetch(`${DOMAIN}/checker/add`, {
      method: 'POST',
      body: JSON.stringify({
        url
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.token}`
      }
    }).then(res => res.json());
    if (good.error)
      throw new Error(good.error);
    console.log("[addUrl] good", good);
    alert('Product added');
    return good;
  } catch (e) {
    alert(e.message);
  }
}

function authVk() {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(['authData'], async ({authData}) => {
        
        if (!authData) {
          const token = await getVkAccessToken();
          const authData = await fetch(`${DOMAIN}/auth/vk/token`, {
          // const authData = await fetch('http://localhost:3000/auth/vk/token', {
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
    
    // chrome.storage.local.get({'vkaccess_token': {}}, ({vkaccess_token}) => {
  
      // if (vkaccess_token.length === undefined) {
        // const vkCLientId = '7173995';
        // const vkCLientId = '7037811';
        const vkCLientId = '7039043';
        const vkAuthenticationUrl = 'https://oauth.vk.com/authorize?client_id=' + vkCLientId + '&redirect_uri=http%3A%2F%2Foauth.vk.com%2Fblank.html&display=page&response_type=token';
  
        chrome.tabs.create({url: vkAuthenticationUrl, selected: true}, (tab) => {
          const authenticationTabId = tab.id;
          chrome.tabs.onUpdated.addListener(listenerHandler(authenticationTabId, resolve, reject));
        });
        
      // } else {
      //   resolve(vkaccess_token);
      // }
      
    // });
  });
  
}

function displayeAnError(textToShow, errorToShow) {
  "use strict";
  
  alert(textToShow + '\n' + errorToShow);
}

chrome.contextMenus.create({
  id: "add",
  title: "Bookmark to wishcheaper"
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "add") {
    addUrl(info.pageUrl);
  }
});