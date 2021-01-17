const puppeteer = require('puppeteer');
const iPhone = puppeteer.devices['iPhone 6'];
const SHOP_NAME = 'amazon.com';
const SHOP_TITLE = 'Amazon';
const SCAN_INTERVAL_MINUTES = 2 * 60;

const log = (text, params = '') => {
  console.log(`[amazonChecker.service] -> ${text}`, params);
};

const parse = async (url, launchParams) => {

  const browser = await puppeteer.launch(launchParams);
  try {
    const page = await browser.newPage();
    await page.emulate(iPhone);

    log(`goto: `, url);
    await page.goto(url, {waitUntil: 'domcontentloaded'});

    let title, currentPrice, logo, oldPrice, inactive_at;
    log(`title`);
    try {
      title = await page.$eval('#title', node => node.textContent);
    } catch (e) {
      console.error(e);
    }

    //PRICE
    log(`price`);
    try {
      currentPrice = await page.$eval('#priceblock_ourprice', node => parseInt(node.innerText.replace(/\s|\$+/g, '')));
    } catch (e) {
      inactive_at = new Date();
    }

    //OLD PRICE
    log(`oldPrice`);
    try {
      oldPrice = await page.$eval('.priceBlockStrikePriceString', node => parseInt(node.innerText.replace(/\s|\$+/g, '')));
    } catch (e) {
      // console.error(e);
    }

    log(`logo`);
    try {
      logo = await page.$eval('#main-image', node => node.getAttribute('src'));
    } catch (e) {
      // console.error(e);
    }

    // inactive
    try {
      const payButton = await page.$('#exportsUndeliverableMobile-cart-announce, #add-to-cart-button, #buy-now-button');
      if (!payButton)
        inactive_at = new Date();
    } catch (e) {
      // console.error(e);
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
  getShopUrl: () => SHOP_NAME,
  SHOP_NAME,
  SHOP_TITLE,
  SCAN_INTERVAL_MINUTES,
};