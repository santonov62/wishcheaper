const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const isDebugMode = false;
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'jd.ru';
const SHOP_TITLE = 'JD';

const log = (text, params = '') => {
  console.log(`[jd.service] -> ${text}`, params);
};

const init = async () => {
  const shop = await shopService.getShopByUrl(SHOP_NAME);
  if (!shop) {
    const addedShop = await shopService.save({
      title: SHOP_TITLE,
      url: `https://${SHOP_NAME}`,
      name: SHOP_NAME,
      scan_interval: 240});
    log(`[init] added shop`, addedShop);
  }
};

init();

const parse = async (url) => {
  
  if (!url)
    throw new Error(`Url required.`);

  let launchParams = { args: [ `--no-sandbox` ], headless: true };
  if (isDebugMode)
    launchParams = { ...launchParams, headless: false };

  const browser = await puppeteer.launch(launchParams);

  try {
    const page = await browser.newPage();

    log(`goto: `, url);
    await page.goto(url, {waitUntil: 'domcontentloaded', timeout: TIMEOUT_DELAY});

    // Wait product data
    try {
      await page.waitFor(() => {
        const priceEl = document.querySelector('.p-price:nth-child(1) > #sku-price');
        return !!priceEl && priceEl.innerText
      }, {timeout: 10000});
    } catch(e) { }

    let title, currentPrice, logo, oldPrice, inactive_at;

    const payButton = await page.$('#addToCart');
    if (!payButton) {
      inactive_at = new Date();
    }

    log(`title`);
    try {
      title = await page.$eval('.title h1', node => node.innerText);
    } catch (e) { }
    
    log(`price`);
    try {
      currentPrice = await page.$eval('.p-price:nth-child(1) > #sku-price', node => parseInt(node.innerText.replace(/\s/g, '')));
    } catch (e) {
      inactive_at = new Date();
    }
  
    log(`oldPrice`);
    try {
      oldPrice = await page.$eval('del', node => parseInt(node.innerText.replace(/\s/g, '')));
    } catch (e) { }
    
    log(`logo`);
    try {
      logo = await page.$eval('#spec-img', node => node.getAttribute('src'))
    } catch (e) { }

    if (!currentPrice) {
      inactive_at = new Date();
    }
    
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