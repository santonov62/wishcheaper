const puppeteer = require('puppeteer');
const isDebugMode = false;
const TIMEOUT_DELAY = 30000;
const SHOP_URL = 'pandao.ru';

const log = (text, params = '') => {
  console.log(`[pandaoChecker.service] ${text}`, params);
};

const parse = async (url) => {

  let launchParams = { args: [ `--no-sandbox` ] };
  if (isDebugMode)
    launchParams = { ...launchParams, headless: false };

  const browser = await puppeteer.launch(launchParams);

  try {
    const page = await browser.newPage();

    log(`goto: `, url);
    await page.goto(url, {waitUntil: 'domcontentloaded', timeout: TIMEOUT_DELAY});
    // log(`done`);

    log(`parse elements: `, url);
    const [title, currentPrice, logo] = await Promise.all([
      page.$eval('.block-content .product-title', node => node.innerText),
      page.$eval('.block-content .current-price', node => parseInt(node.innerText)),
      page.$eval('.photo[data-img]', node => node.getAttribute('data-img'))
    ]);
    let oldPrice;
    try {
      oldPrice = await page.$eval('.block-content .old-price', node => parseInt(node.innerText));
    } catch (e) {
      // log(`No old price`);
    }
    log(`[parse] done`);

    if (!isDebugMode)
      await browser.close();

    return {
      url,
      title,
      price: currentPrice,
      old_price: oldPrice,
      logo
    };

  } catch (e) {
    if (!isDebugMode)
      await browser.close();
    throw new Error(e);
  }
};

const isMyUrl = (url) => {
  return url.indexOf(SHOP_URL) !== -1;
};

module.exports = {
  parse,
  isMyUrl,
  getShopUrl: () => SHOP_URL
};