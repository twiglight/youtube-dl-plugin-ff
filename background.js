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

function download(videoUrl, format) {
    browser.storage.local.get().then((storage) => {
        fetch(storage.url, {
            method: "POST",
            body: new URLSearchParams({
                url: videoUrl,
                format: format
            })
        });
    }, console.log);
}

function createMenuItem(id, icon32) {
    browser.menus.create({
        id: id,
        title: "Download as " + id,
        contexts: ["link"],
        icons: {"32": icon32},
        targetUrlPatterns: ["https://*.youtube.com/watch*", "http://*.youtube.com/watch*"]
    });
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
});

["bestvideo","mp4","flv","webm","ogg","mkv","avi"].forEach(format => {
    createMenuItem(format, 'icons/video.png')
});

browser.menus.create({
    id: 'separator-1',
    type: 'separator',
    contexts: ["link"],
    targetUrlPatterns: ["https://*.youtube.com/watch*", "http://*.youtube.com/watch*"]
});

["bestaudio","aac","flac","mp3","m4a","opus","vorbis","wav"].forEach(format => {
    createMenuItem(format, 'icons/audio.png')
});

browser.runtime.onMessage.addListener((message) => {
    if (message.type === "download" && message.payload) {
        download(message.payload.url, message.payload.format)
    }
});

browser.menus.onClicked.addListener((info, tab) => {
    if (info.linkUrl) {
        download(info.linkUrl, info.menuItemId);
    }
});