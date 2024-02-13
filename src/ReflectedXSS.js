//this is actually DOM XSS


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
        <h1>What is DOM XSS</h1>
        <p>
          DOM-based Cross-Site Scripting (DOM XSS) is a type of security vulnerability
          where the attack payload is executed as a result of modifying the Document Object Model (DOM)
          of a web page. Unlike traditional XSS, which involves the server reflecting malicious
          input, DOM XSS occurs entirely on the client-side. Attackers manipulate the DOM through
          user-controlled input to inject and execute malicious scripts.
        </p>
        <p>
          The consequences of DOM XSS can include unauthorized access to user data, session hijacking,
          and the theft of sensitive information. Web developers must implement proper input validation
          and ensure that user-controlled input does not directly influence the DOM in unsafe ways to
          mitigate the risk of DOM-based XSS attacks.
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
