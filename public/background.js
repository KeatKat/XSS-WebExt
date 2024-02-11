
/*
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
*/


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

//----------------------------------------------------------
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

//-----------------------------------------------------------------
//google searching
//Assigning a unique user id stored locally in the user's browser

const generateUniqueUserId = () => {
  return Math.random().toString(36).substring(2,9);
};

const getUniqueUserId = () => {
  return localStorage.getItem('uniqueUserId');
};

const initializeOrRetrieveUniqueId = () => {
  let uniqueUserId = getUniqueUserId();

  if(!uniqueUserId) {
    uniqueUserId = generateUniqueUserId();
    localStorage.setItem('uniqueUserId', uniqueUserId);
  }

  return uniqueUserId;
};


// Listen for messages from the content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getUniqueUserId') {
    // Respond with the unique user ID
    const uniqueUserId = initializeOrRetrieveUniqueId();

    // Use browser.tabs.sendMessage to send the response to the content script
    browser.tabs.sendMessage(sender.tab.id, { action: 'getUniqueUserId', uniqueUserId });

    // Note: Since sendResponse may not work in all cases, this is an alternative approach
  }
});

browser.webNavigation.onCompleted.addListener(details => {
  // Check if the URL is a Google search
  if (details.url.includes('google.com/search?')) {
    const urlObj = new URL(details.url);
    const searchParam = urlObj.searchParams.get('q');
    const timestamp = new Date().toISOString();

    const userId = getUniqueUserId();

    saveLog({userId, query: searchParam, timestamp});
  }
}, {url: [{hostContains: '.google.com'}]});


async function saveLog(searchResult) {
  console.log(searchResult.query);
  const response = await fetch('http://localhost:8081/createLog', {
    method: 'POST',
    headers: {
      Accept: "application/json",
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: searchResult.userId,
      searches: searchResult.query,
      timestamp: searchResult.timestamp
    }),
  });

  //.then(response => response.json())
  //.then(data => console.log('Search result saved:', data))
  //.catch((error) => console.error('Error saving search result:', error));

  const data = await response.json();
  console.log(data);
}


//--------------------------------------------------------------
//AntiCSRF automatic detection






//---------------------------------------------------------------
//header inspection

let visitedTabs = {};

browser.webRequest.onHeadersReceived.addListener(
  function(info) {
    const tabId = info.tabId;
    if (!visitedTabs[tabId]) {
      visitedTabs[tabId] = true;
      const headers = info.responseHeaders;
      let collectedHeaders = {};

      for (let i = 0; i < headers.length; ++i) {
        let headerName = headers[i].name.toLowerCase();
        let headerValue = headers[i].value;
        console.log(headerName, headerValue)
        collectedHeaders[headerName] = headerValue;
      }

      browser.storage.local.set({ [tabId]: collectedHeaders });
    }
  },
  {urls: ["<all_urls>"]},
  ["blocking", "responseHeaders"]
);

browser.tabs.onRemoved.addListener(function(tabId) {
  delete visitedTabs[tabId];
  browser.storage.local.remove(String(tabId));
});

// csrf
var tabs = {};
var blockedRequests = {};
var blockedInfo = {};
var disabled = false;

// Get all existing tabs
browser.tabs.query({}).then((results) => {
    results.forEach((tab) => {
        tabs[tab.id] = tab;
    });
}).catch(console.error);

// Create tab event listeners
function onUpdatedListener(tabId, changeInfo, tab) {
    tabs[tab.id] = tab;
}

function onRemovedListener(tabId) {
    delete tabs[tabId];
    delete blockedRequests[tabId];
    delete blockedInfo[tabId];
}

// Subscribe to tab events
browser.tabs.onUpdated.addListener(onUpdatedListener);
browser.tabs.onRemoved.addListener(onRemovedListener);


function onBeforeSendHeaders(details){
	if(disabled){
		return;
	}
	//Reset popup blocked info text if user is navigating (main_frame)
	if(details.type == "main_frame"){
		blockedInfo[details.tabId] = "";
	}
	// The tabId will be set to -1 if the request isn't related to a tab.
	if(details.tabId == -1 || (details.type == "main_frame" && details.method == "GET")){
		return;
	}

	should_block = false;

	//Get destination host
	var uri = document.createElement('a');
	uri.href = details.url;
	to_host = uri.host;

	//Get origin host
	uri = document.createElement('a');
	try{
		uri.href=tabs[details.tabId].url;
	}catch(x){
		uri.href = "http://xxx.yyy.zzz";
	}
	from_host = uri.host;

	//data uri's will get empty host
	if(from_host == ""){
		from_host = "xxx.yyy.zzz";
	}

	//Check if it's under the same domain (*.CURRENTDOMA.IN)
	if(from_host !== "newtab" && /\./.test(from_host)){
		//Get "example.com" from "www.ex.example.com"
		pattern_from_host = from_host.match(/[^.]*\.[^.]*$/)[0].replace(/\./g, "\\.");
		//Check if destination host ends with ".?example.com"
		allow = new RegExp("(^|\\.)"+pattern_from_host+"$", "i");
		should_block = !allow.test(to_host);
	}

	if(should_block){
		has_cookie = false;

		//Remove all cookies
		for (var i = 0; i < details.requestHeaders.length; ++i) {
			if (details.requestHeaders[i].name === 'Cookie') {
				has_cookie = true;
				details.requestHeaders.splice(i, 1);
				break;
			}
		}

		if(has_cookie){
			//Only log blocked request if it actually removed a cookie
			blockedInfo[details.tabId] += "Stripped cookies: " + from_host.replace(/xxx.yyy.zzz/g, "data:") + " -> " + to_host + "\n";
			blockedRequests[details.requestId.toString()] = 1;
		}
	}

	return {requestHeaders: details.requestHeaders};
}

function onHeadersReceived(details){
	if(disabled){
		return;
	}
	if(!(details.requestId in blockedRequests)){
		return;
	}
	delete blockedRequests[details.requestId];
	
	for (var i = 0; i < details.responseHeaders.length; ++i) {
		if (details.responseHeaders[i].name === 'Set-Cookie') {
			details.responseHeaders.splice(i, 1);
			//No break here since multiple set-cookie headers are allowed in one response.
		}
	}
	return {responseHeaders: details.responseHeaders};
}

var wr = browser.webRequest;
wr.onBeforeSendHeaders.addListener(onBeforeSendHeaders, {urls: ["https://*/*", "http://*/*"]}, ["blocking", "requestHeaders"]);
wr.onHeadersReceived.addListener(onHeadersReceived, {urls: ["https://*/*", "http://*/*"]}, ["blocking", "responseHeaders"]);

function getCurrentTabUrl(callback) {
  let queryInfo = {
    active: true,
    currentWindow: true
  };

  browser.tabs.query(queryInfo, (tabs) => {
    let tab = tabs[0];
    let url = tab.url;
    console.log("Current tab's URL: " + url);
    callback(url);
  });
}


//Report Handling
//RXSS
let containRXSSStatus = false;

// Listen for messages from the content script and handle the containRXSS update
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateRXSSStatus') {
    // Update the status of containRXSS
    containRXSSStatus = message.containRXSS;
  } else if (message.action === 'getRXSSStatus') {
    // Send the current status of containRXSS to the report page
    sendResponse({ containRXSS: containRXSSStatus });
  }
});

//DOMXSS
let containDOMXSSStatus = false;

// Listen for messages from the content script and handle the containDOMXSS update
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateDOMXSSStatus') {
    // Update the status of containDOMXSS
    containDOMXSSStatus = message.containDOMXSS;
  } else if (message.action === 'getDOMXSSStatus') {
    // Send the current status of containDOMXSS to the report page
    sendResponse({ containDOMXSS: containDOMXSSStatus });
  }
});





