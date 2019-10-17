chrome.runtime.onStartup.addListener(function() {
  vkAuth();
});

// chrome.runtime.onInstalled.addListener(function() {
  // chrome.storage.sync.set({color: '#3aa757'}, function() {
  //   console.log("The color is green.");
  // });
  //
  // chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  //   chrome.declarativeContent.onPageChanged.addRules([{
  //     conditions: [new chrome.declarativeContent.PageStateMatcher({
  //       pageUrl: {hostEquals: 'developer.chrome.com'},
  //     })
  //     ],
  //     actions: [new chrome.declarativeContent.ShowPageAction()]
  //   }]);
  // });
  
// });

chrome.runtime.onMessage.addListener((options, sender) => {
  if (options === 'vkAuth') {
    vkAuth()
  }
});

const vkAuth = () => {
  var
      extensionClientId = 'fccambcnjhpmgegajdgnnlfkanddnjbh',
      vkCLientId           = '7173995',
      redirectUrl = chrome.identity.getRedirectURL(),
      // vkRequestedScopes    = 'docs,offline',
      // vkAuthenticationUrl  = 'https://oauth.vk.com/authorize?client_id=' + vkCLientId + '&scope=' + vkRequestedScopes + '&redirect_uri=http%3A%2F%2Foauth.vk.com%2Fblank.html&display=page&response_type=token';
      vkAuthenticationUrl  = 'https://oauth.vk.com/authorize?client_id=' + vkCLientId + '&redirect_uri='+redirectUrl+'&display=page&response_type=token';
  
  // chrome.storage.local.get({'vkaccess_token': {}}, function (items) {
  //
  //   if (items.vkaccess_token.length === undefined) {
  //     chrome.tabs.create({url: vkAuthenticationUrl, selected: true}, function (tab) {
  //       chrome.tabs.onUpdated.addListener(listenerHandler(tab.id));
  //     });
  //
  //     return;
  //   }
  chrome.identity.launchWebAuthFlow(
      {
        'url': vkAuthenticationUrl,
        'interactive': true
      },
      function(data) {
        alert(data);
      }
  );
  // imageUploadHelperUrl += imageSourceUrl + '&' + items.vkaccess_token;
  
  // chrome.tabs.create({url: imageUploadHelperUrl, selected: true});
  
  // });
};