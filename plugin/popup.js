const codeElem = document.getElementById('code');

chrome.storage.sync.get(['code'], function (result) {
    if (result.code) {
        codeElem.value = result.code;
    }
});

document.getElementById('update-button').onclick = () => {
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
};

document.getElementById('reset-button').onclick = () => {
    document.getElementById('code').value = `function(canvas, video) {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    // Example of putting a rectangle over the video.
    // ctx.fillRect(100, 100, 50, 50);
}`;
};