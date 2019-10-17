
window.onload = () => {
    injectVkScript();
    const vkButton = document.getElementById('vk');
    vkButton.onclick = vkAuth;
};

const injectVkScript = () => {
    let script = document.createElement('script');
    
    script.src = "openapi.js";
    document.head.append(script);
    
    script.onload = () => {
        vkApiInit();
        hideSpinner();
        // vkAuth();
    };
    script.onerror = () => {
        vkApiError();
    };
};

const vkApiError = () => {
    log('vkApiError');
};

const vkApiInit = () => {
    log('vkApiInit');
    window.VK.init({
        apiId: 7037811
    });
};

const log = (value) => {
    console.log(value);
};

const vkAuth = () => {
    
    // chrome.runtime.sendMessage('fccambcnjhpmgegajdgnnlfkanddnjbh', 'vkAuth');
    
    var
        extensionClientId = 'fccambcnjhpmgegajdgnnlfkanddnjbh',
        vkCLientId           = '7173995',
        redirectUrl = chrome.identity.getRedirectURL(),
        // vkRequestedScopes    = 'docs,offline',
        // vkAuthenticationUrl  = 'https://oauth.vk.com/authorize?client_id=' + vkCLientId + '&scope=' + vkRequestedScopes + '&redirect_uri=http%3A%2F%2Foauth.vk.com%2Fblank.html&display=page&response_type=token';
        vkAuthenticationUrl  = 'https://oauth.vk.com/authorize?client_id=' + vkCLientId + '&redirect_uri='+redirectUrl+'&display=page&response_type=token';
    
    chrome.identity.launchWebAuthFlow(
        {
            'url': '',
            'interactive': true
        },
        function(data) {
            alert(data);
        }
    );
};

function listenerHandler(authenticationTabId, imageSourceUrl) {
    "use strict";
    
    return function tabUpdateListener(tabId, changeInfo) {
        var vkAccessToken,
            vkAccessTokenExpiredFlag;
        
        if (tabId === authenticationTabId && changeInfo.url !== undefined && changeInfo.status === "loading") {
            
            if (changeInfo.url.indexOf('oauth.vk.com/blank.html') > -1) {
                authenticationTabId = null;
                chrome.tabs.onUpdated.removeListener(tabUpdateListener);
                
                vkAccessToken = getUrlParameterValue(changeInfo.url, 'access_token');
                alert(vkAccessToken)
                
                if (vkAccessToken === undefined || vkAccessToken.length === undefined) {
                    displayeAnError('vk auth response problem', 'access_token length = 0 or vkAccessToken == undefined');
                    return;
                }
                
                vkAccessTokenExpiredFlag = Number(getUrlParameterValue(changeInfo.url, 'expires_in'));
                
                if (vkAccessTokenExpiredFlag !== 0) {
                    displayeAnError('vk auth response problem', 'vkAccessTokenExpiredFlag != 0' + vkAccessToken);
                    return;
                }
                
                chrome.storage.local.set({'vkaccess_token': vkAccessToken}, function () {
                    chrome.tabs.update(
                        tabId,
                        {
                            'url'   : 'upload.html#?' + vkAccessToken,
                            'active': true
                        },
                        function (tab) {}
                    );
                });
            }
        }
    };
}

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

//
// const renderOrders = (orders = []) => {
//     const ul = document.querySelector('#orders ul');
//     orders.forEach((order) => {
//         const li = document.createElement('li');
//         ul.appendChild(li);
//         const a = document.createElement('a');
//         const title = `${order.shop && order.shop.name} (${order.address})`;
//         const linkText = document.createTextNode(title);
//         a.appendChild(linkText);
//         a.title = title;
//         a.href = order.url;
//         a.target = 'blank';
//         li.appendChild(a);
//     });
// };
//
// const loadOrders = () => {
//     return fetch('https://delivery-group-order.herokuapp.com/')
//         .then(
//             function (response) {
//                 if (response.status !== 200) {
//                     console.log('Looks like there was a problem. Status Code: ' + response.status);
//                     return;
//                 }
//
//                 return response.json();
//             }
//         )
//         .catch(function (err) {
//             console.log('Fetch Error :-S', err);
//         });
// };
//
const showSpinner = () => {
    const spinner = document.querySelector(`.loader`);
    spinner.classList.add(`show`);
};

const hideSpinner = () => {
    const spinner = document.querySelector(`.loader`);
    spinner.classList.add(`hide`);
};