chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "toggle"}, function (response) {
        });
    });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "enable") {
        chrome.browserAction.setIcon({
            path: "icons/icon19-active.png",
            tabId: sender.tab.id
        });
    }

    if (request.message === "disable") {
        chrome.browserAction.setIcon({
            path: "icons/icon19.png",
            tabId: sender.tab.id
        });
    }
});