const proxyHolderService = require('./service/checker/proxyHolder.service');

proxyHolderService.keepProxiesAlive();
setInterval(async () => {
  await proxyHolderService.keepProxiesAlive();
}, 60 * 60000);