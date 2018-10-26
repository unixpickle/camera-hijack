(function () {

    function insertScript(s) {
        s.onload = () => s.remove();
        (document.head || document.documentElement).appendChild(s);
    }

    const s = document.createElement('script');
    s.src = chrome.extension.getURL('injection.js');
    insertScript(s);

    chrome.storage.sync.get(['code'], function (result) {
        if (result.code) {
            const s = document.createElement('script');
            s.text = 'window.INJECTION_DRAW_FN=' + result.code + ';';
            insertScript(s);
        }
    });

})();