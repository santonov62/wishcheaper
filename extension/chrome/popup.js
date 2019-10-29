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
  chrome.runtime.sendMessage('caanfdghlmmflppgchfaocfjhdeaonma', 'vkAuth', {}, function(response) {
    console.log(`Success! `, response);
  });
}

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