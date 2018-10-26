const codeElem = document.getElementById('code');

chrome.storage.sync.get(['code'], function (result) {
    if (result.code) {
        codeElem.value = result.code;
    }
});

document.getElementById('update-button').onclick = () => {
    const code = codeElem.value;
    chrome.storage.sync.set({ code: code });
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            chrome.tabs.executeScript(tab.id, {
                code: 'INJECTION_DRAW_FN=' + code + ';'
            }, function () { });
        });
    });
};
