//ReflectedXSS
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getWebsiteScriptTags') {
    // Get the source code of the current web page
    const sourceCode = document.documentElement.outerHTML;

    // Use DOMParser to parse the HTML and extract script tags
    const parser = new DOMParser();
    const doc = parser.parseFromString(sourceCode, 'text/html');
    // Get all script elements
    const scriptElements = doc.querySelectorAll('script');

    // Extract the innerHTML of each script tag
    const scriptContents = Array.from(scriptElements).map(scriptElement => scriptElement.innerHTML);

    // Send the extracted script contents to the background script
    browser.runtime.sendMessage({ action: 'sendWebsiteScriptTags', scriptContents });

  }
});


//DOMXSS
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.action === 'getWebsiteDOM'){
    const sourceCode = document.documentElement.outerHTML;
    browser.runtime.sendMessage({action: 'sendWebsiteDOM', sourceCode});
  }
});



//Get current URL
// content.js

// Function to handle messages from the background script
const handleMessage = (message) => {
  if (message.action === 'updateURL') {
    // Update your React component with the new URL
    updateURLInReactComponent(message.url);
  }
};

// Function to update your React component with the new URL
const updateURLInReactComponent = (url) => {
  // Your logic to update the URL in your React component
  console.log('Updating URL in React component:', url);
  // You can trigger a state update or any other logic you need
};

// Add a listener for messages from the background script
browser.runtime.onMessage.addListener(handleMessage);



