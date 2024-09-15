"use strict";

let currentEmailContent = '';

const loaderId = setInterval(() => {
  if (!window._gmailjs) {
    return;
  }

  clearInterval(loaderId);
  startExtension(window._gmailjs);
}, 100);

function startExtension(gmail) {
  console.log("Extension: Extension loading...");
  window.gmail = gmail;

  gmail.observe.on("load", () => {
    const userEmail = gmail.get.user_email();
    console.log("Extension: Hello, " + userEmail + ". This is your extension talking!");
  });

  gmail.observe.on("view_email", (domEmail) => {
    console.log("Extension: Email viewed", domEmail);
    try {
      currentEmailContent = domEmail.$el[0].innerText;
      console.log("Extension: Email content stored");
    } catch (error) {
      console.error("Extension: Error getting email content", error);
    }
  });
}

window.addEventListener('message', (event) => {
  console.log('Extension: Received postMessage', event.data);
  if (event.data.type === 'GET_EMAIL_BODY') {
    try {
      if (currentEmailContent) {
        console.log('Extension: Sending stored email content');
        window.postMessage({ 
          type: 'FROM_PAGE_SCRIPT', 
          action: 'updateEmailBody', 
          emailBody: currentEmailContent
        }, '*');
      } else {
        console.error('Extension: No email content stored');
        window.postMessage({ 
          type: 'FROM_PAGE_SCRIPT', 
          action: 'updateEmailBody', 
          emailBody: 'No email content stored. Please open an email and try again.'
        }, '*');
      }
    } catch (error) {
      console.error('Extension: Error sending email contents', error);
      window.postMessage({ 
        type: 'FROM_PAGE_SCRIPT', 
        action: 'updateEmailBody', 
        emailBody: 'Error sending email contents. Please try again.'
      }, '*');
    }
  }
});