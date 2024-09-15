document.addEventListener('DOMContentLoaded', () => {
    console.log('Sidepanel: DOMContentLoaded');
    const emailBodyTextarea = document.getElementById('emailBody');
    const readEmailButton = document.getElementById('readEmailButton');

    readEmailButton.addEventListener('click', () => {
        console.log('Sidepanel: Read Email Body button clicked');
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "getEmailBody"});
        });
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('Sidepanel: Received message', message);
        if (message.action === 'updateEmailBody') {
            emailBodyTextarea.value = message.emailBody;
        }
    });
});