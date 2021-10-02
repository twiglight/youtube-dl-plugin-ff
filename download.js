const CURRENT_WINDOW = {active: true, currentWindow: true};

function download(tab) {
    browser.storage.local.get().then((storage) => {
        fetch(storage.url, {
            method: "POST",
            body: new URLSearchParams({
                url: tab.url,
                format: document.querySelector("#input-format").value
            })
        });
    }, console.log);
}

function loadCurrentTabInfo(tab) {
    document.querySelector("#input-download-url").value = tab.title;
}

document.querySelector("form").addEventListener("submit", async event => {
    event.preventDefault();

    browser.tabs.query(CURRENT_WINDOW)
        .then((t) => { download(t[0]); })
        .catch(console.log);

        document.querySelector("#submit").innerText = "Downloading...";
        document.querySelector("#submit").disabled = true;
});

browser.tabs.query(CURRENT_WINDOW)
    .then((t) => { loadCurrentTabInfo(t[0]); })
    .catch(console.log);