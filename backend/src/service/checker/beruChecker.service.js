const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const isVisible = true;
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'beru.ru';
const SHOP_TITLE = 'Беру';

const log = (text, params = '') => {
  console.log(`[beruChecker.service] -> ${text}`, params);
};

const init = async () => {
  const shop = await shopService.getShopByUrl(SHOP_NAME);
  if (!shop) {
    const addedShop = await shopService.save({
      title: SHOP_TITLE,
      url: `https://${SHOP_NAME}`,
      name: SHOP_NAME,
      scan_interval: 720})
    log(`[init] added shop`, addedShop);
  }
};

init();

const parse = async (url) => {
  
  if (!url)
    throw new Error(`Url required.`);

  let launchParams = { args: [ `--no-sandbox` ], headless: true };
  if (isVisible)
    launchParams = { ...launchParams, headless: false };

  const browser = await puppeteer.launch(launchParams);

  try {
    const page = await browser.newPage();

    log(`goto: `, url);
    // await page.goto('https://beru.ru', {waitUntil: 'domcontentloaded', timeout: TIMEOUT_DELAY});
    await page.goto(url, {waitUntil: 'networkidle0', timeout: TIMEOUT_DELAY});
    // log(`done`);
    //
    // let inactive_at;
    // const payButton = await page.$('[data-zone-name="offer-cart"] .section button');
    // if (!payButton) {
    //   inactive_at = new Date();
    // }
    
    let title, currentPrice, logo, oldPrice, inactive_at;
  
    log(`inactive_at`);
    const unavalibleEl = await page.$('[data-zone-name="skuAvailability"]>div>span');
    if (!!unavalibleEl) {
      inactive_at = new Date();
    }
    
    log(`title`);
    try {
      title = await page.$eval('.section > div > h1', node => node.innerText);
    } catch (e) { }
    
    log(`price`);
    try {
      currentPrice = await page.$eval('[data-zone-name="offer-cart"] [data-auto="price"]', node => parseInt(node.innerText.replace(/\s/g, '')));
    } catch (e) { }
  
    log(`oldPrice`);
    try {
      oldPrice = await page.$eval('[data-zone-name="offer-cart"] [data-auto="old-price"]', node => parseInt(node.innerText.replace(/\s/g, '')));
    } catch (e) { }
    
    log(`logo`);
    try {
      logo = await page.$eval('[data-zone-name="image"] img', node => node.getAttribute('src'))
    } catch (e) { }
    
    const parsedData = {
        url,
        title,
        price: currentPrice,
        old_price: oldPrice,
        logo,
        inactive_at
    };
    
    log(`[parse] done`, parsedData);

    return parsedData;

  } catch (e) {
    throw new Error(e);
  } finally {
    // if (!isVisible)
      await browser.close();
  }
};

const isMyUrl = (url) => {
  return url.indexOf(SHOP_NAME) !== -1;
};

module.exports = {
  parse,
  isMyUrl,
  getShopUrl: () => SHOP_NAME
};