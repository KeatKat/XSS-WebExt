import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './CSS/ReflectedXSS.css';

function ReflectedXSS() {
  const [scriptContents, setScriptContents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredScripts, setFilteredScripts] = useState([]);
  const [suspiciousCount, setSuspiciousCount] = useState(0);

  const handleCheckWebsite = () => {
    // Send a message to background.js when the button is clicked
    browser.runtime.sendMessage({ action: 'checkWebsite' });
  };

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'sendWebsiteSourceCode') {
      console.log("reflectedxss now");
      const currentScriptContent = message.currentScriptContent;
      setScriptContents(currentScriptContent);
      setCurrentIndex(0); // Reset the index when new content is received
    }
  });

  useEffect(() => {
    // Filter scripts when scriptContents changes
    filterScripts();
  }, [scriptContents]);

  const filterScripts = () => {
    // Implement your filtering logic here
    const filtered = scriptContents.map((content, index) => {

      const maxLength = 200; // Adjust the maximum length as needed
      const maliciousKeywords = ['eval(', 'document.cookie', 'write(', 'unescape(', 'SetCookie(', 'GetCookie('];
      const obfuscatedPattern = /\b(?:eval|decodeURIComponent)\(/;

      if (content.length >= maxLength) {
        return { label: 'Long Lines of Code', content, index };
      } else if (maliciousKeywords.some((keyword) => content.includes(keyword))) {
        return { label: 'Malicious Keyword Detected', content, index };
      } else if (obfuscatedPattern.test(content)) {
        return { label: 'Obfuscated Code Detected', content, index };
      }

      // Exclude lines that pass the criteria
      return null;
    }).filter(Boolean);

    setFilteredScripts(filtered);
    setCurrentIndex(0); // Reset the index when new content is received
    setSuspiciousCount(filtered.length); // Update the suspicious count
  };

  const handleNextSnippet = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, filteredScripts.length - 1));
  };

  const handlePrevSnippet = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
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
        <p>Suspicious Lines Count: {suspiciousCount}</p>
        <div className="script-contents-display">
          {filteredScripts.length > 0 && (
            <div className="script-content">
              <p>{filteredScripts[currentIndex].label}</p>
              <pre>{filteredScripts[currentIndex].content}</pre>
            </div>
          )}
        </div>
        <div className="navigation-buttons">
          <button onClick={handlePrevSnippet} disabled={currentIndex === 0}>
            Previous Snippet
          </button>
          <button onClick={handleNextSnippet} disabled={currentIndex === filteredScripts.length - 1}>
            Next Snippet
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReflectedXSS;
