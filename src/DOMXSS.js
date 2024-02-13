import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './CSS/DOMXSS.css';

function DOMXSS() {
  const [url, setUrl] = useState('');
  const [vulnerabilityDetected, setVulnerabilityDetected] = useState(false);
  const [maliciousPart, setMaliciousPart] = useState('');

  const handleCheckURL = () => {
    const scriptIndex = url.indexOf('<script>');
    if (scriptIndex !== -1) {
      setVulnerabilityDetected(true);
      const startIndex = Math.max(0, scriptIndex - 20); // Start 20 characters before '<script>'
      const endIndex = scriptIndex + 8; // End 8 characters after '<script>'
      setMaliciousPart(url.substring(startIndex, endIndex));
    } else {
      setVulnerabilityDetected(false);
      setMaliciousPart('');
    }
  };

  return (
    <div className="DOMXSS-page">
      <Sidebar />
      <div className="DOMXSS-content">
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
        <div className="url-input-container">
          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={handleCheckURL}>Check URL</button>
        </div>
        {vulnerabilityDetected && (
          <div className="vulnerability-detected">
            <h2>Potential DOM-based XSS Detected!</h2>
            <p>This URL may contain a potential DOM-based XSS vulnerability.</p>
            <p>Highlighted Malicious Part: <span className="malicious-part">{maliciousPart}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DOMXSS;
