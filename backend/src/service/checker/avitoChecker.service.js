const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const isDebugMode = false;
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'avito.ru';
const SHOP_TITLE = 'Avito';

const log = (text, params = '') => {
  console.log(`[avitoChecker.service] -> ${text}`, params);
};

const init = async () => {
  const shop = await shopService.getShopByUrl(SHOP_NAME);
  if (!shop) {
    const addedShop = await shopService.save({title: SHOP_TITLE, url: `https://${SHOP_NAME}`, name: SHOP_NAME})
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

  // setTimeout(() => {
  //   if (browser)
  //     browser.close();
  // }, 2 * 60000);

  try {
    const page = await browser.newPage();

    log(`goto: `, url);
    await page.goto(url, {waitUntil: 'domcontentloaded', timeout: TIMEOUT_DELAY});
    // log(`done`);

    let title, currentPrice, logo, oldPrice;
    log(`$eval title`);
    try {
      title = await page.$eval('.title-info-title-text', node => node.innerText);
    } catch (e) {
    
    }
    
    log(`$eval price`);
    try {
      currentPrice = await page.$eval('.js-item-price', node => node.getAttribute('content'));
    } catch (e) {
    
    }
  
    log(`$eval oldPrice`);
    try {
      oldPrice = await page.$eval('.item-price-old', node => parseInt(node.innerText));
    } catch (e) {
    
    }
    
    log(`$eval .photo[data-img]`);
    try {
      logo = await page.$eval('.gallery-img-frame', node => node.getAttribute('data-url').replace(/\/\//, 'https://'));
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

    if (!isDebugMode)
      await browser.close();

    return parsedData;

  } catch (e) {
    if (!isDebugMode)
      await browser.close();
    throw new Error(e);
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