const puppeteer = require('puppeteer');
const {ProxyChecker} = require('proxy-checker');

class ProxyHolder {

  constructor() {
    this.lastUpdateTime = 0;
    this.proxiesList = [];
    this.parseProxiesPromise = null;
    this.minAliveProxies = 5;
    this.proxiesExpiredMinutes = 60 * 24;
    this.updateProxiesMinutes = 30;
    this.keepProxiesAlive();
  }

  async parseProxydockerProxies () {
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
      log(`proxies`, proxies);
      return proxies;
    } catch (e) {
      throw new Error(e);
    } finally {
      browser.close();
    }
  };

  async _parseSpysone () {
    this._log(`[parseSpysone]`);
    let proxies = [];
    const browser = await puppeteer.launch({args: [`--no-sandbox`], headless: true});
    try {
      const page = await browser.newPage();
      const url = `http://spys.one/free-proxy-list/RU/`;

      this._log(`goto: `, url);
      await page.goto(url, {waitUntil: 'networkidle0'});
      this._log(`done`);

      this._log(`.spy1xx[onmouseover], .spy1x[onmouseover]`);
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

    } catch (e) {
      this._log(`Error `, e.message);
    } finally {
      browser.close();
    }
    this._log(`[parseSpysone]`, proxies);
    return proxies;
  };

  async _updateProxies () {
    try {
      if (!this.parseProxiesPromise) {
        this.parseProxiesPromise = this._parseSpysone();
      }
      let proxies = await this.parseProxiesPromise;
      proxies = proxies.filter(proxy => !this.proxiesList.some(({ip}) => ip === proxy.ip));
      this.proxiesList = this.proxiesList.concat(proxies);
    } finally {
      this.parseProxiesPromise = null;
      this.lastUpdateTime = Date.now();
    }
  };

  async _isProxyValid (proxy) {
    if (!proxy)
      return false;
    this._log(`[isProxyValid] check`, proxy);
    const [address, port] = proxy.ip.split(':');
    let pc = new ProxyChecker(address, port, {
      requestCheckUrl: 'https://avito.ru',
      checkResponse: function(proxyHost, proxyPort, requestUrl, rawResponse, realIp) {
        let response = this.constructor.parseHttpResponse(rawResponse);
        return !!response.body;
      },
      timeout: 10000,
      userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0',
      checkProxyTypes: ['socks5', 'socks4', 'connect', 'http']
    });
    const result = await pc.check();
    this._log(`[isProxyValid] ${proxy.ip} result: `, result);
    return result.http;
  };

  async keepProxiesAlive () {
    if (this._isProxiesNeedUpdate(this.minAliveProxies)) {
      await this._updateProxies();
    }
    await this._filterInvalidProxies();
    setTimeout(async () => {
      this.keepProxiesAlive();
    }, this.updateProxiesMinutes * 60000);
  };

  async _filterInvalidProxies () {
    this._log(`[filterInvalidProxies]`);
    const proxiesCount = this.proxiesList.length;
    const promises = [];
    for (let i = 0; i <= proxiesCount; i++) {
      const proxy = this.proxiesList.pop();
      promises.push(this._isProxyValid(proxy).then(isValid => isValid && this.proxiesList.unshift(proxy)));
    }
    await Promise.all(promises);
    this._log(`[filterInvalidProxies] done`, this.proxiesList);
  };

  async pullProxy () {
    if (this._isProxiesNeedUpdate()) {
      await this._updateProxies();
    }
    const proxy = this.proxiesList.shift();
    this._log(`[pullProxy]`, proxy);
    return proxy;
  };

  pushProxy (proxy) {
    this.proxiesList.push(proxy);
    this._log(`[pushProxy]`, proxy)
  };

  unshiftProxy (proxy) {
    this.proxiesList.unshift(proxy);
    this._log(`[unshiftProxy]`, proxy)
  };

  _isProxiesNeedUpdate (minProxiesCount = 1) {
    const isExpired = Date.now() - this.lastUpdateTime > 60000 * this.proxiesExpiredMinutes;
    const isPoor = !this.proxiesList || this.proxiesList.length < minProxiesCount;
    return isExpired || isPoor;
  };

  _log (text, params = '') {
    console.log(`${this.constructor.name} ${text}`, params);
  };

}

module.exports = new ProxyHolder();