const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const isDebugMode = false;
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'pandao.ru';
const SHOP_TITLE = 'Pandao';

const log = (text, params = '') => {
  console.log(`[pandaoChecker.service] -> ${text}`, params);
};

const init = async () => {
  const shop = await shopService.getShopByUrl(SHOP_NAME);
  if (!shop) {
    const addedShop = await shopService.save({
      title: SHOP_TITLE,
      url: `https://${SHOP_NAME}`,
      name: SHOP_NAME,
      scan_interval: 15})
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
    // log(`done`);

    let title, currentPrice, logo, oldPrice;
    log(`title`);
    try {
      title = await page.$eval('.block-content .product-title', node => node.innerText);
    } catch (e) {
    
    }
    
    log(`price`);
    try {
      currentPrice = await page.$eval('.block-content .current-price', node => parseInt(node.innerText));
    } catch (e) {
    
    }
  
    log(`oldPrice`);
    try {
      oldPrice = await page.$eval('.block-content .old-price', node => parseInt(node.innerText));
    } catch (e) {
    
    }
    
    log(`logo`);
    try {
      logo = await page.$eval('.photo[data-img]', node => node.getAttribute('data-img'))
    } catch (e) {
    
    }
    const parsedData = {
        url,
        title,
        price: currentPrice,
        old_price: oldPrice,
        logo
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

const getClippedUrl = (url) => {
  const match = url.match(/((http(s)?(\:\/\/))+(www\.)?([\w\-\.\/])*(\.[a-zA-Z]{2,3}\/?))[^\s\b\n|]*[^.,;:\?\!\@\^\$ -]/g);
  return match && match[0];
};

module.exports = {
  parse,
  isMyUrl,
  getClippedUrl,
  getShopUrl: () => SHOP_NAME
};