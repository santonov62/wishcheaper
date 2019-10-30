function getAuthData() {
  return sessionStorage.getItem('authData');
}

chrome.runtime.sendMessage({
  action: "authData",
  data: getAuthData()
});