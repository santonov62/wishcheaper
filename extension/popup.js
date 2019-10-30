window.onload = () => {
  // injectVkScript();

  const vkButton = document.getElementById('vk');
  vkButton.onclick = vkAuth;

  const addByUrlButton = document.getElementById('addByUrl');
  addByUrlButton.onclick = addByUrl;

  chrome.storage.local.get(['authData'], ({authData}) => {
    if (!!authData) {
      addByUrlButton.classList.remove('hidden');
    } else {
      vkButton.classList.remove('hidden');
    }
    hideSpinner();
  });

};

function addByUrl() {

}

function vkAuth() {

}

// const injectVkScript = () => {
//     let script = document.createElement('script');
//
//     script.src = "openapi.js";
//     document.head.append(script);
//
//     script.onload = () => {
//         window.VK.init({
//             apiId: 7037811
//         });
//         hideSpinner();
//     };
//     script.onerror = () => {
//         log('vkApiError');
//     };
// };

const log = (value) => {
  console.log(value);
};

// const showSpinner = () => {
//     const spinner = document.querySelector(`.loader`);
//     spinner.classList.add(`show`);
// };

const hideSpinner = () => {
  const spinner = document.querySelector(`.loader`);
  spinner.classList.add(`hidden`);
};