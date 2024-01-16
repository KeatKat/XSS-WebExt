import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import DOMPurify from 'dompurify';
import './CSS/DOMXSS.css';

function DOMXSS() {
  const [originalDOMContents, setOriginalDOMContents] = useState('');
  const [sanitizedDOMContents, setSanitizedDOMContents] = useState('');
  const [removedLines, setRemovedLines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCheckWebsite = () => {
    browser.runtime.sendMessage({ action: 'getDOM' });
  };

  useEffect(() => {
    // Check and sanitize the DOM contents when it changes
    const sanitizedHTML = DOMPurify.sanitize(originalDOMContents);

    // Identify lines that have been removed
    const originalLines = originalDOMContents.split('\n');
    const sanitizedLines = sanitizedHTML.split('\n');
    const removed = originalLines.filter((line, index) => sanitizedLines[index] !== line);

    setSanitizedDOMContents(sanitizedHTML);
    setRemovedLines(removed);
    setCurrentIndex(0); // Reset the index when new content is received
  }, [originalDOMContents]);

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'sendWebsiteDOMcode') {
      const webDOM = message.webDOM;
      setOriginalDOMContents(webDOM);
    }
  });

  const handleNextSnippet = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, removedLines.length - 1));
  };

  const handlePrevSnippet = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  return (
    <div className="DOMXSS-page">
      <Sidebar />
      <div className="DOMXSS-content">
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
        {removedLines.length > 0 && (
          <div className="removed-lines">
            <h2>Removed Lines</h2>
            <p>{`Snippet ${currentIndex + 1} of ${removedLines.length}`}</p>
            <pre>{removedLines[currentIndex]}</pre>
            <div className="navigation-buttons">
              <button onClick={handlePrevSnippet} disabled={currentIndex === 0}>
                Previous Snippet
              </button>
              <button
                onClick={handleNextSnippet}
                disabled={currentIndex === removedLines.length - 1}
              >
                Next Snippet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DOMXSS;
