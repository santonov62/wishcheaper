const puppeteer = require('puppeteer');
const iPhone = puppeteer.devices['iPhone 6'];
const SHOP_NAME = 'dns-shop.ru';
const SHOP_TITLE = 'DNS';

const log = (text, params = '') => {
  console.log(`[dnsShopChecker.service] -> ${text}`, params);
};

const parse = async (url, launchParams) => {
  
  const browser = await puppeteer.launch(launchParams);

  try {
    const page = await browser.newPage();
    await page.emulate(iPhone);

    log(`goto: `, url);
    await page.goto(url, {waitUntil: 'networkidle2'});

    let inactive_at;
    
    let title, currentPrice, logo, oldPrice;
    log(`title`);
    try {
      title = await page.$eval('.price-item-title', node => node.innerText);
    } catch (e) {
      console.error(e);
    }
    log(`price`);
    try {
      currentPrice = await page.$eval('.product-card-price__current', node => parseInt(node.innerText.replace(/\s/g, '')));
    } catch (e) {
      console.error(e);
    }
    log(`oldPrice`);
    try {
      oldPrice = await page.$eval('.product-card-price__previous', node => parseInt(node.innerText.replace(/\s/g, '')));
    } catch (e) {
      console.error(e);
    }
    log(`logo`);
    try {
      logo = await page.$eval('img.product-images-slider__img', node => node.getAttribute('src'))
    } catch (e) {
      console.error(e);
    }

    try {
      const payButton = await page.$('.notify-btn');
      if (!!payButton) {
        inactive_at = new Date();
      }
    } catch (e) {
      console.error(e);
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
  withProxy: true,
  SHOP_TITLE,
  SHOP_NAME
};