//ReflectedXSS
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


//DOMXSS
browser.runtime.onMessage.addListener((request, sender, sendResponse)=>{
  if(request.action === 'getDOM'){
    console.log("background1");
    browser.tabs.query({active: true, currentWindow: true}, (tabs)=>{
      const activeTab = tabs[0];
      browser.tabs.sendMessage(activeTab.id, {action: 'getWebsiteDOM'});
    });
  }

  if(request.action === 'sendWebsiteDOM'){
    const webDOM = request.sourceCode;
    browser.runtime.sendMessage({action:"sendWebsiteDOMcode", webDOM});
  }
});




//-----------------------------------------------------------


//Reflected XSS automatic detection
// Listen for webNavigation events
browser.webNavigation.onCompleted.addListener((details) => {
  // Check if the navigation is in the main frame
  if (details.frameId === 0) {
    const url = details.url;
    console.log(url);
    
    // Send the URL to the content script
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      browser.tabs.sendMessage(activeTab.id, { action: 'updateURL', url });
    });
  }
});

// Listen for messages from the popup or other parts of the extension
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getURL') {
    // Request the URL when needed
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      browser.tabs.sendMessage(activeTab.id, { action: 'requestURL' });
    });
  }
});


//Auto DOM Detection
// Auto DOM XSS detection
browser.webNavigation.onCompleted.addListener((details) => {
  // Check if the navigation is in the main frame
  if (details.frameId === 0) {
    // Send a message to the content script to check DOM XSS content
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      browser.tabs.sendMessage(activeTab.id, { action: 'checkDOMXSSContent' });
    });
  }
});

// Listen for messages from the popup or other parts of the extension
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'redirectGoogle') {
    // Redirect the user back to Google
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      browser.tabs.update(activeTab.id, { url: 'https://www.google.com' });
    });
  }
});


