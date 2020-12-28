const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'mvideo.ru';
const SHOP_TITLE = 'Мвидео';
const iPhone = puppeteer.devices['iPhone 6'];

const log = (text, params = '') => {
  console.log(`[mvideoChecker.service] -> ${text}`, params);
};

const init = async () => {
  const shop = await shopService.getShopByUrl(SHOP_NAME);
  if (!shop) {
    const addedShop = await shopService.save({
      title: SHOP_TITLE,
      url: `https://${SHOP_NAME}`,
      name: SHOP_NAME,
      scan_interval: 720});
    log(`[init] added shop`, addedShop);
  }
};

init();

const parse = async (url) => {
  
  if (!url)
    throw new Error(`Url required.`);

  let launchParams = { args: [ `--no-sandbox` ], headless: !process.env.PUPPETEER_DEV };

  const browser = await puppeteer.launch(launchParams);

  try {
    const page = await browser.newPage();
    await page.emulate(iPhone);

    log(`goto: `, url);
    await page.goto(url, {waitUntil: 'domcontentloaded', timeout: TIMEOUT_DELAY});

    let inactive_at;
    const payButton = await page.$('.o-pay__btn.sel-pdp-button-place-to-cart');
    if (!payButton) {
      inactive_at = new Date();
    }
      // throw new Error(`Product is out of stock.`);

    let title, currentPrice, logo, oldPrice;
    //TITLE
    log(`$eval title`);
    try {
      title = await page.$eval('.o-pdp-topic__title', node => node.innerText);
    } catch (e) { }
    
    //PRICE
    log(`$eval price`);
    try {
      currentPrice = await page.$eval('.fl-pdp-price__current', node => parseInt(node.innerText.replace(/\s+/g, '')));
    } catch (e) {
      inactive_at = new Date();
    }
  
    //OLD PRICE
    log(`$eval oldPrice`);
    try {
      oldPrice = await page.$eval('.fl-pdp-price__old', node => parseInt(node.innerText.replace(/\s+/g, '')));
    } catch (e) { }
    
    log(`$eval .photo[data-img]`);
    try {
      logo = await page.$eval('.c-media-container__image-wrapper img', node => node.getAttribute('src').replace(/\/\//, 'https://'));
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
    if (!process.env.PUPPETEER_KEEP_OPENED)
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