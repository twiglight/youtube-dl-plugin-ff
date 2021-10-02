const YT_REGEX = /^((https|http)(:\/\/))(www\.)?(youtube)(\..*\/)(watch).*(v=[a-zA-Z]*)&?.*$/g;

function isApplicable(url) {
    return url.match(YT_REGEX) != null;
}

function initialize(tab) {
    if (isApplicable(tab.url)) {
        browser.pageAction.setIcon({tabId: tab.id, path: "icons/48.png"});
        browser.pageAction.setTitle({tabId: tab.id, title: "Send to download server"});
        browser.pageAction.show(tab.id);
    }
}

browser.tabs.query({}).then((tabs) => {
  for (let tab of tabs) {
    initialize(tab);
  }
});

browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
    initialize(tab);
});

browser.browserAction.onClicked.addListener(() => {
    browser.tabs.create({
        "url": "settings.html"
    });
})