import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './CSS/ReflectedXSS.css';

function ReflectedXSS() {
  const [scriptContents, setScriptContents] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  const handleCheckWebsite = () => {
    // Send a message to background.js when the button is clicked
    browser.runtime.sendMessage({ action: 'checkWebsite' });
  };

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'sendWebsiteScriptTags') {
      const currentScriptContents = message.scriptContents;
      setScriptContents(currentScriptContents);
      setStartIndex(0); // Reset the start index when new content is received
    }
  });

  const handleNextLines = () => {
    setStartIndex(startIndex + 5);
  };

  const handlePrevLines = () => {
    setStartIndex(Math.max(0, startIndex - 5));
  };

  return (
    <div className="RXSS-page">
      <Sidebar />
      <div className="RXSS-content">
        <h1>What is Reflected XSS</h1>
        <p>
          Reflected Cross-Site Scripting (XSS) is a type of security vulnerability
          where an attacker injects malicious scripts into a web application, and
          these scripts are then reflected off a web server to the victim's browser.
          The attack is often delivered through a URL or other input fields that
          echo user input without proper validation.
        </p>
        <p>
          The consequences of Reflected XSS can include theft of sensitive information,
          session hijacking, and defacement of websites. Web developers must implement
          proper input validation and output encoding to mitigate the risk of Reflected XSS.
        </p>
        <button onClick={handleCheckWebsite}>Check Website</button>
        <div className="script-contents-display">
          {scriptContents.slice(startIndex, startIndex + 5).map((content, index) => (
            <div key={index} className="script-content">
              <pre>{content}</pre>
            </div>
          ))}
        </div>
        <div className="navigation-buttons">
          <button onClick={handlePrevLines} disabled={startIndex === 0}>
            Previous 5 Lines
          </button>
          <button onClick={handleNextLines} disabled={startIndex + 5 >= scriptContents.length}>
            Next 5 Lines
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReflectedXSS;
