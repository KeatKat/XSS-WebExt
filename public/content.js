// content.js
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

    console.log("content now");
  }
});
