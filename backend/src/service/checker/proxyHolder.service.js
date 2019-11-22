const puppeteer = require('puppeteer');

let lastUpdateTime = 0;
let proxiesList = [];
let parseProxiesPromise = null;

const parseProxydockerProxies = async () => {
  log(`parseProxydockerProxies`);
  let proxies = [];
  const browser = await puppeteer.launch({args: [`--no-sandbox`], headless: true});
  try {
    const page = await browser.newPage();
    // const url = `https://www.proxydocker.com/en/proxylist/search?port=All&type=HTTP&anonymity=All&country=Russia&city=All&state=All&need=All`;
    const url = `https://www.proxydocker.com/en/proxylist/search?type=http&anonymity=all&port=&country=Russia&city=&state=all&need=all`;

    log(`goto: `, url);
    await page.goto(url, {waitUntil: 'networkidle0'});
    log(`done`);
  
    const selector = '#proxylist_table tr';
    log(`waitFor: `, selector);
    await page.waitForFunction(selector => document.querySelectorAll(selector).length > 1, {}, selector);

    log(`eval`, '.proxylist_table tbody tr');
    proxies = await page.$$eval(selector, (trs) => {
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

const parseSpysone = async () => {
  log(`parseSpysone`);
  let proxies = [];
  const browser = await puppeteer.launch({args: [`--no-sandbox`], headless: false});
  try {
    const page = await browser.newPage();
    const url = `http://spys.one/free-proxy-list/RU/`;

    log(`goto: `, url);
    await page.goto(url, {waitUntil: 'networkidle0'});
    log(`done`);

    log(`.spy1xx[onmouseover], .spy1x[onmouseover]`);
    proxies = await page.$$eval(`.spy1xx[onmouseover], .spy1x[onmouseover]`, trs => {
      return trs.map(tr => {
        const ip = tr.querySelector(`tr>td:nth-child(1)`).innerText;
        const ping = tr.querySelector(`tr>td:nth-child(6)`).innerText;
        return {
          ip,
          ping
        }
      });
    });
    log(`done `);

    log(`done`);
    proxies = [...new Set([...proxiesList, ...proxies])];
    log(`proxies`, proxies);
    lastUpdateTime = Date.now();
    return proxies;
  } catch (e) {
    log(`Error `, e.message);
    throw new Error(e);
  } finally {
    browser.close();
  }
};

const updateProxies = async () => {
  try {
    if (!parseProxiesPromise) {
      // parseProxiesPromise = parseProxydockerProxies();
      parseProxiesPromise = parseSpysone();
    }
    proxiesList = await parseProxiesPromise;
  } finally {
    parseProxiesPromise = null;
  }
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
  const isExpired = Date.now() - lastUpdateTime > 60000 * 10;
  const isPoor = !proxiesList || proxiesList.length < 10;
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