chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason !== 'install') {
        return;
    }

    chrome.storage.local.set({ReadingLine: true});
    toggleIcon(true);

    chrome.tabs.query({windowType: 'normal'}, function (tabs) {
        for (var i in tabs) {
            chrome.scripting.insertCSS({
                target: {tabId: tabs[i].id},
                css: "reading-line.css",
            });

            chrome.scripting.executeScript({
                target: {tabId: tabs[i].id},
                files: ['reading-line.js'],
            });

            chrome.tabs.sendMessage(tabs[i].id, {
                action: "ReadingLine-enable"
            });
        }
    });
});

function toggleIcon(isEnabled) {
    if (isEnabled) {
        chrome.action.setIcon({
            path: "icons/icon19-active.png",
        });
    }
    else {
        chrome.action.setIcon({
            path: "icons/icon19.png",
        });
    }
}

function toggleExtensionStatus(isEnabled) {
    toggleIcon(isEnabled);
    chrome.storage.local.set({ ReadingLine: isEnabled }, function(){
        chrome.tabs.query({windowType: 'normal'}, function (tabs) {
            for (var i in tabs) {
                chrome.tabs.sendMessage(tabs[i].id, {
                    action: isEnabled ? "ReadingLine-enable" : "ReadingLine-disable"
                });
            }
        });
    });
}

chrome.storage.local.get(['ReadingLine'], function(result) {
    toggleIcon(result.ReadingLine);
});

chrome.action.onClicked.addListener(function (tab) {
    chrome.storage.local.get(['ReadingLine'], function(result) {
        toggleExtensionStatus(!result.ReadingLine);
    });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message === "ReadingLine-status") {
        chrome.storage.local.get(['ReadingLine'], function(result) {
            sendResponse(result.ReadingLine);
        });
        return true;
    }

    if (message === "ReadingLine-enable") {
        toggleExtensionStatus(true);
    }

    if (message === "ReadingLine-disable") {
        toggleExtensionStatus(false);
    }
});


