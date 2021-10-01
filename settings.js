function loadSavedSettings(storage) {
    if (storage.url) {
        document.querySelector("#input-url").value = storage.url;
    }
}

function logError(error) {
    console.log(e);
}

document.querySelector("form").addEventListener("submit", async event => {
    event.preventDefault();

    browser.storage.local.set({
        url: document.querySelector("#input-url").value
    });
});

browser.storage.local.get().then(loadSavedSettings, logError);