const puppeteer = require('puppeteer');
const urls = [
    `https://donpedrobot.herokuapp.com/`,
    `https://findpromo-ru.herokuapp.com/`
];
const MINUTES_INTERVAL = 10;

makeAlive();
setInterval(makeAlive, MINUTES_INTERVAL * 60000);

async function makeAlive() {
  for (const url of urls) {
    await openUrl(url);
  }
}

async function openUrl(url) {
  const browser = await puppeteer.launch({args: [`--no-sandbox`], headless: true});
  try {
    _log('openUrl', url);
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    _log('LIVE!');
  } catch (e) {
    _log(`ERROR: `, e.message);
  } finally {
    browser.close();
  }
}

function _log (text, params = '') {
  console.log(`[pedrobotKeepLife] ${text}`, params);
};