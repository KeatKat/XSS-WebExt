
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



//---------------------------------------------------------------
//Auto reflectedXSS detection
// Function to handle messages from the background script
const handleMessage = (message) => {
  if (message.action === 'updateURL') {
    // Update your React component with the new URL
    updateURLInReactComponent(message.url);
  } else if (message.action === 'requestURL') {
    // Send the current URL back to the background script
    const currentURL = window.location.href;
    browser.runtime.sendMessage({ action: 'gotURL', url: currentURL });
  }
};

// Function to update your React component with the new URL
const updateURLInReactComponent = (url) => {
  // Your logic to update the URL in your React component
  //googleSearch(url);
  let containRXSS = false;
  // Check for potential XSS
  if (url.includes('script')) {
    containRXSS = true;
    //Send over data to background
    browser.runtime.sendMessage({ action: 'updateRXSSStatus', containRXSS });
    // First confirmation prompt
    if (confirm('This website may contain a potential XSS attack. Do you want to continue?')) {
      // User clicked OK in the first prompt
      // Double-check with a second confirmation prompt
      if (confirm('Are you sure you want to enter this website?')) {
        // User clicked OK in the second prompt, proceed to the website
        console.log('User confirmed and chose to continue to the website.');
      } else {
        // User clicked Cancel in the second prompt, redirect to google.com
        console.log('User confirmed in the first prompt but canceled in the second prompt. Redirecting to google.com.');
        window.location.href = 'https://www.google.com';
      }
    } else {
      // User clicked Cancel in the first prompt, redirect to google.com
      console.log('User chose to cancel and is being redirected to google.com.');
      window.location.href = 'https://www.google.com';
    }
  }
  else{
    browser.runtime.sendMessage({ action: 'updateRXSSStatus', containRXSS });

  }
  


};

// Add a listener for messages from the background script
browser.runtime.onMessage.addListener(handleMessage);

// Send the current URL back to the background script on page load
handleMessage({ action: 'requestURL' });
//----------------------------------------------------------------

//DOM XSS automatic
// Function to handle messages from the background script for DOM XSS

const handleDOMXSSMessage = (message) => {
  if (message.action === 'checkDOMXSSContent') {
    // Get the HTML content of the page
    const htmlContent = document.documentElement.outerHTML;
    antiCSRFDetect(htmlContent);
    let containDOMXSS = false;
    // Check for script tags and the presence of "alert" in the HTML content
    if (htmlContent.includes('<script>') && htmlContent.includes('alert(')) {
      containDOMXSS = true;
      browser.runtime.sendMessage({ action: 'updateDOMXSSStatus', containDOMXSS });


      // Prompt the user if they want to continue
      const userResponse = confirm('This website may contain a potential DOM-based XSS attack. Do you want to continue?');

      if (userResponse) {
        // Prompt the user one more time
        const secondResponse = confirm('Are you sure you want to proceed?');

        if (!secondResponse) {
          // Redirect the user back to Google
          browser.runtime.sendMessage({ action: 'redirectGoogle' });
        }
      } else {
        // Redirect the user back to Google
        browser.runtime.sendMessage({ action: 'redirectGoogle' });
      }
    }
    else {
      browser.runtime.sendMessage({ action: 'updateDOMXSSStatus', containDOMXSS });
    }
  }
};



// Add a listener for messages from the background script for DOM XSS
browser.runtime.onMessage.addListener(handleDOMXSSMessage);



//-----------------------------------------------------------------
//Google searching data tracking
let uniqueUserId
// Function to handle messages from the background script
const handleUniqueUserIdMessage = (message) => {
  if (message.action === 'getUniqueUserId') {
    // Handle the unique user ID received from the background script
    uniqueUserId = message.uniqueUserId;
  }
};

// Add a listener for messages from the background script
browser.runtime.onMessage.addListener(handleUniqueUserIdMessage);

// Request the unique user ID from the background script
browser.runtime.sendMessage({ action: 'getUniqueUserId' });





//After 3 searches. Show a consolidation
//---------------------------------------------------------------------
//Anti CSRF detection (automatic)
function antiCSRFDetect(html){
  if (html.includes('<input type="hidden" name="csrftoken"')){
    alert("Anti-CSRF tokens detected");

  }
}




//------------------------------------------------------------------------


window.addEventListener("load", perftiming, false);
function perftiming (evt) {
	    browser.runtime.sendMessage({browser_message: "msg", count: "0"}, function(response) {
	});
}

document.addEventListener("DOMContentLoaded", function () {
  browser.tabs.query({ currentWindow: true, active: true }).then((tabArray) => {
      const currentTabId = tabArray[0].id;
      browser.runtime.sendMessage({ type: "getTabInfo", tabId: currentTabId });
  });

  const checkbox = document.getElementById("disable");
  checkbox.addEventListener("click", function () {
      browser.runtime.sendMessage({ type: "toggleDisable", value: checkbox.checked });
  });

  browser.runtime.onMessage.addListener((message) => {
      if (message.type === "updatePopup") {
          const info = document.getElementById("info");
          const reload = document.getElementById("reload");

          if (message.blockedInfo) {
              info.innerText = message.blockedInfo;
              reload.style.display = "block";
              reload.onclick = function () {
                  browser.tabs.reload(message.tabId);
              };
          }
      }
  });
});




