// const DOMAIN = `https://wishcheaper.herokuapp.com`;
const DOMAIN = `http://localhost:3000`;

let shops = [];
const shopsPromise = fetch(`${DOMAIN}/shops`, {
      method: 'GET'
    }).then(res => res.json());

window.onload = async () => {
  
  shops = await shopsPromise;
  
  const vkButton = document.getElementById('vk');
  vkButton.onclick = vkAuth;

  // const addButton = document.getElementById('add');
  // addButton.onclick = addCurrent;

  const openButton = document.getElementById('open');
  openButton.onclick = openProduct;
  
  const supportedShops = document.getElementById('supportedShops');
  supportedShops.onclick = () => {
    alert(shops.map(shop => `${shop.name} - ${shop.title}`).join('\n'))
  };

  chrome.storage.local.get(['authData'], ({authData}) => {
    if (!!authData) {
      hideButtons();
      addCurrent();
    } else {
      // vkButton.classList.remove('hidden');
      showButtons();
    }
    hideSpinner();
  });

};

function openProduct() {
  const {goodItem} = window;
  const url = `${DOMAIN}/my?id=${goodItem.id}`;
  chrome.tabs.create({url, selected: true}, (tab) => {

    // chrome.tabs.onUpdated.addListener(vkAuthListener(tab.id));
  });
}

function addCurrent() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    const tab = tabs[0];
    const url = tab.url;
    console.log(tab)
    if (isShopSupported(url)) {
      addByUrl(tab.url)
    } else {
      showShopsSupported()
    }
  })
}

function isShopSupported(url) {
  // const shops = await shopsPromise;
  return shops.some(shop => url.indexOf(shop.name) !== -1);
}

function vkAuth() {
  chrome.runtime.sendMessage('', {action: 'vkAuth', data: { url: `${DOMAIN}/login` }});
}

async function addByUrl(url) {
  console.group('[addByUrl] ', url);
  showSpinner();
  try {
    let authData = await getAuthData();
    if (!authData)
      throw new Error(`authData required`);

    authData = JSON.parse(authData);

    const good = await fetch(`${DOMAIN}/checker/add`, {
      method: 'POST',
      body: JSON.stringify({
        url
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.user.token}`
      }
    }).then(res => res.json());
    window.goodItem = good;
    if (good.error)
      throw new Error(good.error);
    console.log("[addUrl] good", good);
    // showMessage(`Товар теперь в отслеживаемых`);
    showSuccess();
    return good;
  } catch (e) {
    console.log(e.message);
    if (e && e.message.indexOf('AUTHORIZATION_ERROR') !== -1) {
      showButtons();
    } else {
      showError();
    }
  } finally {
    console.groupEnd();
    hideSpinner();
  }
}

async function getAuthData() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['authData'], async ({authData}) => {
      if (!authData) {
        reject(authData)
      } else {
        resolve(authData)
      }
    });
  });
}

const showSpinner = () => {
  const spinner = document.getElementById(`spinner`);
  spinner.classList.remove('hidden');
  hideContent();
};
const hideSpinner = () => {
  const spinner = document.getElementById(`spinner`);
  spinner.classList.add(`hidden`);
  showContent();
};

const showContent = () => {
  const content = document.getElementById(`content`);
  content.classList.remove('hidden');
};
const hideContent = () => {
  const content = document.getElementById(`content`);
  content.classList.add('hidden');
};

const showMessage = (text) => {
  hideButtons();
  const el = document.getElementById(`message`);
  el.innerText = text;
  el.classList.remove(`hidden`);
};
const hideMessage = () => {
  const message = document.getElementById(`message`);
  message.classList.add(`hidden`);
  showButtons();
};

const hideButtons = () => {
  const el = document.getElementById(`buttons`);
  el.classList.add(`hidden`);
};
const showButtons = () => {
  const el = document.getElementById(`buttons`);
  el.classList.remove(`hidden`);
};

const showSuccess = () => {
  const el = document.getElementById(`success`);
  el.classList.remove(`hidden`);
};
const showError = () => {
  const el = document.getElementById(`error`);
  el.classList.remove(`hidden`);
};
const showShopsSupported = () => {
  const el = document.getElementById(`shopsSupported`);
  el.classList.remove(`hidden`);
};

const log = (value) => {
  console.log(value);
};