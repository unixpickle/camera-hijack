const codeElem = document.getElementById('code');
const defaultCode = `function(canvas, video) {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    // Example of putting a rectangle over the video.
    // ctx.fillRect(100, 100, 50, 50);
}`;

function initialize() {
    chrome.storage.sync.get(['code'], function (result) {
        if (result.code) {
            codeElem.value = result.code;
        }
    });

    document.getElementById('update-button').onclick = updateCode;
    document.getElementById('reset-button').onclick = () => {
        document.getElementById('code').value = defaultCode;
        updateCode();
    };
}

function updateCode() {
    const code = codeElem.value;
    const escaped = JSON.stringify('window.INJECTION_DRAW_FN=' + code + ';');
    const injectCode = `
        (function() {
            const s = document.createElement('script');
            s.text = ` + escaped + `;
            s.onload = () => s.remove();
            (document.head || document.documentElement).appendChild(s);
        })()`;
    chrome.storage.sync.set({ code: code });
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            chrome.tabs.executeScript(tab.id, {
                code: injectCode
            }, function () { });
        });
    });
}

initialize();