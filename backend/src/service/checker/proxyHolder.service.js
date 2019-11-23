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
  log(`[parseSpysone]`);
  let proxies = [];
  const browser = await puppeteer.launch({args: [`--no-sandbox`], headless: true});
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

    lastUpdateTime = Date.now();

  } catch (e) {
    log(`Error `, e.message);
    // throw new Error(e);
  } finally {
    browser.close();
  }
  log(`[parseSpysone]`, proxies);
  return proxies;
};

const updateProxies = async () => {
  try {
    if (!parseProxiesPromise) {
      // parseProxiesPromise = parseProxydockerProxies();
      parseProxiesPromise = parseSpysone();
    }
    let proxies = await parseProxiesPromise;
    proxies = proxies.filter(proxy => !proxiesList.some(({ip}) => ip === proxy.ip));
    proxiesList = proxiesList.concat(proxies);
  } finally {
    parseProxiesPromise = null;
  }
};
const isProxyValid = async (proxy) => {
  log(`[isProxyValid]`, proxy);
  if (!proxy)
    return false;

  const browser = await puppeteer.launch({args: [`--proxy-server=${proxy.ip}`, `--no-sandbox`]});
  try {
    const page = await browser.newPage();
    await page.goto(`https://www.google.ru`, {timeout: 15000});
    log(`[isProxyValid] done`, proxy);
    return true;
  } catch (e) {
    log(`[isProxyValid] Error: ${e.message}`, proxy);
  } finally {
    browser.close();
  }
  return false;
};
const filterInvalidProxies = async () => {
  log(`[filterInvalidProxies]`);
  const proxiesCount = proxiesList.length;
  for (let i = 0; i <= proxiesCount; i++) {
    const proxy = proxiesList.pop();
    if (await isProxyValid(proxy)) {
      proxiesList.unshift(proxy);
    }
  }
  log(`[filterInvalidProxies] done`, proxiesList);
};
const keepProxiesAlive = async () => {
  if (isProxiesNeedUpdate(10)) {
    await updateProxies();
  }
  await filterInvalidProxies();
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
const isProxiesNeedUpdate = (minProxiesCount = 1) => {
  const isExpired = Date.now() - lastUpdateTime > 60000 * 60 * 24;
  const isPoor = !proxiesList || proxiesList.length < minProxiesCount;
  return isExpired || isPoor;
};

const log = (text, params = '') => {
  console.log(`[proxyHolder] ${text}`, params);
};

module.exports = {
  pushProxy,
  unshiftProxy,
  pullProxy,
  keepProxiesAlive
};