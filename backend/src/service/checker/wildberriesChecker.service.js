const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const isDebugMode = false;
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'wildberries.ru';
const SHOP_TITLE = 'wildberries';

const log = (text, params = '') => {
  console.log(`[wildberries.service] -> ${text}`, params);
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
  if (isDebugMode)
    launchParams = { ...launchParams, headless: false };

  const browser = await puppeteer.launch(launchParams);

  try {
    const page = await browser.newPage();

    log(`goto: `, url);
    await page.goto(url, {waitUntil: 'domcontentloaded', timeout: TIMEOUT_DELAY});

    let title, currentPrice, logo, oldPrice, inactive_at;
    log(`title`);
    try {
      title = await page.$eval('.brand-and-name.j-product-title', node => node.innerText);
    } catch (e) { }
    
    log(`price`);
    try {
      currentPrice = await page.$eval('.final-cost', node => parseInt(node.innerText.replace(/\s/g, '')));
    } catch (e) {
      inactive_at = new Date();
    }
  
    log(`oldPrice`);
    try {
      // oldPrice = await page.$eval('.top-sale-block div div div div div', node => parseInt(node.innerText.replace(/\s/g, '')));
      oldPrice = await page.$eval('.old-price', node => parseInt(node.innerText.replace(/\s/g, '')));
    } catch (e) { }
    
    log(`logo`);
    try {
      logo = await page.$eval('img.preview-photo.j-preview-photo', node => node.getAttribute('src'))
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