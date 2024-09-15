"use strict";

function addScript(src) {
    console.log('ExtensionInjector: Adding script', src);
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = chrome.runtime.getURL(src);
    (document.body || document.head || document.documentElement).appendChild(script);
}

addScript("dist/gmailJsLoader.js");
addScript("dist/extension.js");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('ExtensionInjector: Received message', message);
    if (message.action === 'getEmailBody') {
        window.postMessage({ type: 'GET_EMAIL_BODY' }, '*');
    }
});

window.addEventListener('message', (event) => {
    console.log('ExtensionInjector: Received postMessage', event.data);
    if (event.data.type === 'FROM_PAGE_SCRIPT') {
        chrome.runtime.sendMessage(event.data);
    }
});