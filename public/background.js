// background.js
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkWebsite') {
    // Send a message to content.js with the source code of the current web page
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      browser.tabs.sendMessage(activeTab.id, { action: 'getWebsiteScriptTags' });
    });
  }

  if(request.action === 'sendWebsiteScriptTags'){
    const currentScriptContent = request.scriptContents;
    browser.runtime.sendMessage({action:"sendWebsiteSourceCode",currentScriptContent});
  }
});


