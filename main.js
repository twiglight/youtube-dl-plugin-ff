const YT_REGEX = /^((https|http)(:\/\/))(www\.)?(youtube)(\..*\/)(watch).*(v=[a-zA-Z]*)&?.*$/g;

function download(tab) {
    if (isApplicable(tab.url)) {
        browser.storage.local.get().then((storage) => {
            if (!storage.url) {
                browser.pageAction.setIcon({tabId: tab.id, path: "icons/failed.png"});
            } else {
                fetch(storage.url, {
                    method: "POST",
                    body: new URLSearchParams({
                        url: tab.url,
                        format: storage.format ?? "bestvideo"
                    })
                }).then(() => {
                    browser.pageAction.setIcon({tabId: tab.id, path: "icons/success.png"});
                }, () => {
                    browser.pageAction.setIcon({tabId: tab.id, path: "icons/failed.png"});
                });
            }
        }, (e) => { console.log(e); });
        
    }
}

function isApplicable(url) {
    return url.match(YT_REGEX) != null;
}

function initialize(tab) {
    if (isApplicable(tab.url)) {
        browser.pageAction.setIcon({tabId: tab.id, path: "icons/default.png"});
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

browser.pageAction.onClicked.addListener(download);

browser.browserAction.onClicked.addListener(() => {
    browser.tabs.create({
        "url": "settings.html"
    });
})