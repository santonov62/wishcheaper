const puppeteer = require('puppeteer');

keepLife();
setInterval(() => {
  try {
    keepLife();
  } catch(e) {
    console.log(e.message);
  }
}, 10 * 60000);

async function keepLife() {
  const browser = await puppeteer.launch({args: [`--no-sandbox`], headless: true});
  try {
    const page = await browser.newPage();
    await page.goto(`https://donpedrobot.herokuapp.com/`, {waitUntil: 'domcontentloaded'});
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