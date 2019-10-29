const DOMAIN = `http://localhost:3000`;

window.onload = () => {

  const vkButton = document.getElementById('vk');
  vkButton.onclick = vkAuth;

  const addButton = document.getElementById('add');
  addButton.onclick = addCurrent;

  chrome.storage.local.get(['authData'], ({authData}) => {
    if (!!authData) {
      addButton.classList.remove('hidden');
    } else {
      vkButton.classList.remove('hidden');
    }
    hideSpinner();
  });

};

function addCurrent() {
  // chrome.tabs.getCurrent(tab => {
  //   console.log(tab)
  //   addByUrl(tab.url)
  // });
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    const tab = tabs[0];
    console.log(tab)
      addByUrl(tab.url)
  })
}

function vkAuth() {
  chrome.runtime.sendMessage('', {action: 'vkAuth', data: { url: `${DOMAIN}/login` }});
}

async function addByUrl(url) {
  console.group('[addByUrl] ', url);
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
    if (good.error)
      throw new Error(good.error);
    console.log("[addUrl] good", good);
    alert('Product added');
    return good;
  } catch (e) {
    alert(e.message);
  } finally {
    console.groupEnd();
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
    const spinner = document.querySelector(`.loader`);
    spinner.classList.add(`show`);
};

const hideSpinner = () => {
  const spinner = document.querySelector(`.loader`);
  spinner.classList.add(`hidden`);
};

const log = (value) => {
  console.log(value);
};