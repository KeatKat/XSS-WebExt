import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './CSS/AntiCSRF.css';

function AntiCSRF() {

  const [requests, setRequests] = useState([]);
  const [blockedInfo, setBlockedInfo] = useState('');
  const [currentTabId, setCurrentTabId] = useState(null);

  useEffect(() => {
    // Get current tab ID and request blocked info from the background script
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs[0]) {
        setCurrentTabId(tabs[0].id);
        browser.runtime.sendMessage({ type: 'getTabInfo', tabId: tabs[0].id });
      }
    });

    const handleMessage = (message) => {
      if (message.type === 'updateTabInfo' && message.tabId === currentTabId) {
        setRequests(prev => [...prev, message.requestDetails]);
        setBlockedInfo(message.blockedInfo);
      }
    };

    browser.runtime.onMessage.addListener(handleMessage);

    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, [currentTabId]);
  
  return (
    <div className="AntiCSRF-page">
      <Sidebar />
      <div className="AntiCSRF-content">
        <h1>What is Anti Cross-Site Request Forgery (Anti-CSRF)</h1>
        <p>
          Anti Cross-Site Request Forgery (Anti-CSRF) is a security measure designed to
          protect web applications from unauthorized, malicious actions performed on behalf
          of an authenticated user. CSRF attacks exploit the trust that a web application has
          in a user's browser by tricking it into making unintended, malicious requests.
        </p>
        <p>
          To prevent CSRF attacks, web developers implement Anti-CSRF tokens, unique and
          unpredictable values embedded in forms or requests. These tokens validate the
          authenticity of each request, ensuring that they originated from the legitimate
          user and not from a malicious source.
        </p>
      </div>
      <div>
        <h2>CSRF Requests Monitor</h2>
        {requests.length > 0 ? (
          requests.map((request, index) => (
            <div key={index}>
              <p>URL: {request.url}</p>
              <p>Method: {request.method}</p>
              <p>Includes CSRF Token: {request.hasCsrfToken ? 'Yes' : 'No'}</p>
            </div>
          ))
        ) : (
          <p>No requests to display.</p>
        )}
        {blockedInfo && (
          <div>
            <h3>Blocked Info:</h3>
            <p>{blockedInfo}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AntiCSRF;
