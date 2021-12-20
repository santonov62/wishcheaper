const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'mvideo.ru';
const SHOP_TITLE = 'Мвидео';
const iPhone = puppeteer.devices['iPhone 6'];

const log = (text, params = '') => {
  console.log(`[mvideoChecker.service] -> ${text}`, params);
};

const parse = async (url, launchParams) => {

  const browser = await puppeteer.launch(launchParams);
  try {
    const page = await browser.newPage();
    await page.emulate(iPhone);

    log(`goto: `, url);
    await page.goto(url, {waitUntil: 'networkidle2', timeout: TIMEOUT_DELAY});

    let inactive_at;
    const payButton = await page.$('.mv-main-button--content');
    if (!payButton) {
      inactive_at = new Date();
    }
      // throw new Error(`Product is out of stock.`);

    let title, currentPrice, logo, oldPrice;
    //TITLE
    try {
      title = await page.$eval('.title-brand', node => node.innerText);
    } catch (e) {
      console.error(e);
    }
    log(`$eval title`, title);

    //PRICE
    try {
      currentPrice = await page.$eval('.btn-container .price__main-value', node => parseInt(node.innerText.replace(/\s+/g, '')));
    } catch (e) {
      inactive_at = new Date();
    }
    log(`$eval price`, currentPrice);

    //OLD PRICE
    try {
      oldPrice = await page.$eval('.btn-container .price__sale-value', node => parseInt(node.innerText.replace(/\s+/g, '')));
    } catch (e) {
      console.error(e);
    }
    log(`$eval oldPrice`, oldPrice);

    try {
      logo = await page.$eval('.zoomable-image__image', node => node.getAttribute('src').replace(/\/\//, 'https://'));
    } catch (e) {
      console.error(e);
    }
    log(`$eval .photo[data-img]`, logo);

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

const isMyUrl = (url) => {
  return url.indexOf(SHOP_NAME) !== -1;
};

init();

module.exports = {
  parse,
  isMyUrl,
  getShopUrl: () => SHOP_NAME
};