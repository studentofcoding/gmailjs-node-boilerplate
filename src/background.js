chrome.action.onClicked.addListener((tab) => {
    console.log('Background: Extension icon clicked');
    if (tab.url.includes("mail.google.com")) {
      chrome.sidePanel.open({ windowId: tab.windowId });
    }
  });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background: Received message', message);
    if (message.action === 'getEmailBody') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          console.log('Background: Sending getEmailBody message to content script');
          chrome.tabs.sendMessage(tabs[0].id, { action: 'getEmailBody' })
            .catch(error => console.error('Background: Error sending message:', error));
        } else {
          console.error('Background: No active tab found');
        }
      });
    }
});