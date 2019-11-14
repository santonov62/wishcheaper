function getAuthData() {
  return localStorage.getItem('authData');
}

chrome.runtime.sendMessage({
  action: "authData",
  data: getAuthData()
});