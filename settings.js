function loadSavedSettings(storage) {
    if (storage.url) {
        document.querySelector("#input-url").value = storage.url;
    }

    if (storage.format){
        document.querySelector("#input-format").value = storage.format;
    } else {
        document.querySelector("#input-format").value = 'bestvideo';
    }
}

function logError(error) {
    console.log(e);
}

document.querySelector("form").addEventListener("submit", async event => {
    event.preventDefault();

    browser.storage.local.set({
        url: document.querySelector("#input-url").value,
        format: document.querySelector("#input-format").value
    });
});

browser.storage.local.get().then(loadSavedSettings, logError);