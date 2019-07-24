const puppeteer = require('puppeteer');

let lastUpdateTime = 0;
let proxiesList = [];
let parseProxiesPromise = null;
const TIMEOUT_DELAY = 30000;

const parseProxydockerProxies = async () => {
  log(`parseProxydockerProxies`);
  const browser = await puppeteer.launch({args: [`--no-sandbox`], headless: true});
  try {
    const page = await browser.newPage();
    // const url = `https://www.proxydocker.com/en/proxylist/search?port=All&type=HTTP&anonymity=All&country=Russia&city=All&state=All&need=All`;
    const url = `https://www.proxydocker.com/en/proxylist/search?type=http&anonymity=all&port=&country=Russia&city=&state=all&need=all`;

    log(`goto: `, url);
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    log(`done`);
  
    // log(`waitForNavigation: `, '.proxylist_table');
    // await page.waitFor('.proxylist_table tr td:first-child:not([colspan])', {visible: true});
    // log(`done`);
  
    // await page.waitFor('.proxylist_table tbody tr', {visible: true});
    log(`waitFor: `, '.proxylist_table tbody tr');
    const selector = '.proxylist_table tbody tr';
    await page.waitFor(selector => document.querySelectorAll(selector).length > 0, {}, selector);
    
    log(`eval`, '.proxylist_table tbody tr');
    let proxies = await page.$$eval('.proxylist_table tbody tr', (trs) => {
      const ips = [];
      trs.forEach(tr => {
        const ip = tr.querySelector('td:first-child:not([colspan])').textContent.trim();
        if (!!ip) {
          const pingSpan = tr.querySelector('.proxy-ping-span');
          const ping = pingSpan && pingSpan.getAttribute('style').match(/(?:)(\d+)(?=%)/g)[0];
          ips.push({ip: ip, ping});
        }
      });
      return ips;
    });
    log(`done`);

    proxies = [...new Set([...proxiesList, ...proxies])];
    log(`proxies`, proxies);
    lastUpdateTime = Date.now();
    return proxies;
  } catch (e) {
    throw new Error(e);
  } finally {
    browser.close();
  }
};
const updateProxies = async () => {
  if (!parseProxiesPromise) {
    parseProxiesPromise = parseProxydockerProxies();
  }
  proxiesList = await parseProxiesPromise;
  parseProxiesPromise = null;
};
const pullProxy = async () => {
  if (isProxiesNeedUpdate()) {
    await updateProxies();
  }
  const proxy = proxiesList.shift();
  log(`pullProxy`, proxy);
  return proxy;
};
const pushProxy = (proxy) => {
  proxiesList.push(proxy);
  log(`pushProxy`, proxy)
};
const unshiftProxy = (proxy) => {
  proxiesList.unshift(proxy);
  log(`unshiftProxy`, proxy)
};
const isProxiesNeedUpdate = () => {
  if (proxiesList > 1000)
    return;

  const isExpired = Date.now() - lastUpdateTime > 60000 * 10;
  const isPoor = proxiesList.length < 10;
  return isExpired || isPoor;
};

const log = (text, params = '') => {
  console.log(`[proxyHolder] ${text}`, params);
};

module.exports = {
  pushProxy,
  unshiftProxy,
  pullProxy
};