
window.onload = () => {
    // showSpinner();
    // const orders = await loadOrders();
    // renderOrders(orders);
    // hideSpinner();
    injectVkScript();
};

const injectVkScript = () => {
    let script = document.createElement('script');
    
    script.src = "https://vk.com/js/api/openapi.js?162";
    document.head.append(script);
    
    script.onload = () => {
        vkApiInit();
        hideSpinner();
        VK.Auth.login(session => {
            log('session')
        });
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