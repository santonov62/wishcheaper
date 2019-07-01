const fetch = require('node-fetch');
const FormData = require('form-data');
const subscriptionService = require('./subscriptions.service');

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
  console.log(`[vk.service] -> ${text}`, params);
};

notify = async ({id, url, price, old_price, title, usersVk, prevPrice}) => {
  const formData = new FormData();
  const priceDiff = prevPrice - price;
  formData.append('message', `${title}
  
  Снижение цены на ${priceDiff} р
  ${prevPrice} р -> ${price} р
  
   ${url}`);
  formData.append('user_ids', usersVk);
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
      return json;
    });
};

const notifyAll = async ({id, url, price, old_price, title, prevPrice}) => {
  if (!id)
    throw new Error(`Good id required.`);
  const subscriptions = await subscriptionService.search({good_id: id});

  while (subscriptions.length > 0) {
    const chunk = subscriptions.splice(0, 100);
    const usersVk = chunk.map(subscription => subscription.user_vk).join(',');
    const result = await notify({url, usersVk, price, old_price, title, prevPrice});
    log(`[notifyAll] [chunk] done`, result);
  }
};

module.exports = {
  notify,
  notifyAll
};