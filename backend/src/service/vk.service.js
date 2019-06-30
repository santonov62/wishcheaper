const fetch = require('node-fetch');
const FormData = require('form-data');

const apiVersion = process.env.VK_API_VERSION;
if (!apiVersion) {
  console.error('ERROR!: Please set VK_API_VERSION to .env file before running the app.');
  process.exit();
}
const accessToken = process.env.VK_COMMUNITY_KEY;
if (!accessToken) {
  console.error('ERROR!: Please set VK_COMMUNITY_KEY to .env file before running the app.');
  process.exit();
}

const log = (text, params) => {
  console.log(`[vk.service] ${text}`, params);
};

notify = async ({url, userVk}) => {

  const formData = new FormData();
  formData.append('message', `Снижение цены!
   ${url}`);
  formData.append('user_ids', userVk);
  formData.append('access_token', accessToken);
  formData.append('v', apiVersion);
  return fetch(`https://api.vk.com/method/messages.send`, {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then((json) => {
      const {error} = json;
      if (!!error)
        throw new Error(error.error_msg);
      log(`[notify] done`, json);
    });

  // const message = `Изменилась цена на товар ${url}`;
  // return fetch(`https://api.vk.com/method/messages.send`, {
  //   method: 'POST',
  //   body: {
  //     message,
  //     user_ids: userVk,
  //     access_token: accessToken,
  //     v: apiVersion
  //   },
  //   headers: {
  //     'Content-Type': 'multipart/form-data'
  //   }
  // })
  //   .then(res => res.json())
  //   .then((json) => {
  //     const {error} = json;
  //     if (!!error)
  //       throw new Error(error.error_msg);
  //     log(`[notify] done`, json);
  //   });
};

module.exports = {
  notify
};