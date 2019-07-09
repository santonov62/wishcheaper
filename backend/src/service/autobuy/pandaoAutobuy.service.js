const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const isDebugMode = false;
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'pandao.ru';

const log = (text, params = '') => {
  console.log(`[pandaoChecker.service] -> ${text}`, params);
};

const buy = async ({url, price, autobuy_price}) => {

  if (!url)
    throw new Error(`Url required.`);
  if (!price)
    throw new Error(`price required.`);
  if (!autobuy_price)
    throw new Error(`autobuy_price required.`);

  let launchParams = { args: [ `--no-sandbox` ], headless: true };
  if (isDebugMode)
    launchParams = { ...launchParams, headless: false };

  const browser = await puppeteer.launch(launchParams);

  try {
    const page = await browser.newPage();

    log(`goto: `, url);
    await page.goto(url, {waitUntil: 'domcontentloaded', timeout: TIMEOUT_DELAY});

    await page.waitFor('.btn-login-sign:not(.log-reg)', {visible: true}).then(btn => btn.click());
    await page.waitFor('.log-in-tabs .extra-item.mail', {visible: true}).then(btn => btn.click());
    await page.waitFor('[name=login_form] [type=email]');
    await page.type('[name=login_form] [type=email]', 'flex62ryz@ya.ru');
    await page.type('[name=login_form] [type=password]', 'Hjkcty&07');
    await page.click('[name=login_form] [type=submit]');
    await page.waitFor('.enable2fa .gray-btn.log-in-btn', {visible: true}).then(btn => btn.click());
    await page.waitFor('.blue-btn.buy-now', {visible: true}).then(btn => btn.click());
    const confirmOrderButton = await page.waitFor('.cart-info-box-price .blue-btn.mt-12', {visible: true});
    const buyPrice = await page.$eval(`.cart-info-box-price.total>div`, node => parseInt(node.innerText));
    if (buyPrice > price)
      throw new Error(`Now price is greater than good price`);
    await confirmOrderButton.click();
    await page.waitFor('.cart-info-box-price .blue-btn.mt-12', {visible: true}).then(btn => btn.click());
    await page.waitFor('.thank-you-title');

    log(`[buy] done`);
    return {url, price, autobuy_price, buyPrice};

  } catch (e) {
    throw new Error(e);

  } finally {
    // if (!isDebugMode)
      await browser.close();
  }
};

const isMyUrl = (url) => {
  return url.indexOf(SHOP_NAME) !== -1;
};

module.exports = {
  buy,
  isMyUrl,
  getShopUrl: () => SHOP_NAME
};