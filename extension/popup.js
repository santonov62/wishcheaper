
window.onload = () => {
    injectVkScript();
    // const vkButton = document.getElementById('vk');
    // vkButton.onclick = vkAuth;
};

const injectVkScript = () => {
    let script = document.createElement('script');
    
    script.src = "openapi.js";
    document.head.append(script);
    
    script.onload = () => {
        window.VK.init({
            apiId: 7037811
        });
        hideSpinner();
    };
    script.onerror = () => {
        log('vkApiError');
    };
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