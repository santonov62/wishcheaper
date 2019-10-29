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
  // chrome.tabs.create({url: 'http://localhost:3000', selected: true}, (tab) => {
  chrome.tabs.create({url: 'http://localhost:3000'}, (tab) => {
    alert()
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
      alert(response.farewell);
    });
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