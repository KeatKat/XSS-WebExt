import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import './CSS/HeaderInspection.css';

function HeaderInspection() {
  const [headers, setHeaders] = useState({});
  const [risks, setRisks] = useState([]);

  useEffect(() => {
    // Function to get headers from the current tab
    const fetchHeaders = async () => {
      try {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        const tabId = tabs[0].id;
        const storedHeaders = await browser.storage.local.get(String(tabId));
        setHeaders(storedHeaders[tabId] || {});
        setRisks(analyzeHeaders(storedHeaders[tabId] || {}));
      } catch (error) {
        console.error('Error fetching headers:', error);
      }
    };

    fetchHeaders();
  }, []);

  // Function to analyze headers
  function analyzeHeaders(headers) {
    let warnings = [];

    //need to add more
    if (!headers['content-security-policy']) {
      warnings.push('Missing Content-Security-Policy: Vulnerable to XSS and data injection attacks.');
    } else {
      warnings.push(...analyzeCSP(headers['content-security-policy']));
    }

    return warnings;
  }

  // Function to analyze CSP
  function analyzeCSP(cspHeader) {
    let warnings = [];

    if (cspHeader.includes("'unsafe-inline'")) {
      warnings.push("CSP uses 'unsafe-inline' which can be a security risk.");
    }
    if (cspHeader.includes("'unsafe-eval'")) {
      warnings.push("CSP uses 'unsafe-eval' which can be a security risk.");
    }
    if (cspHeader.includes("https:") || cspHeader.includes("http:")) {
      warnings.push("CSP allows all HTTPS and HTTP sources. Consider restricting to specific trusted domains.");
    }

    return warnings;
  }

  return (
    <div className="HeaderInspection-page">
      <Sidebar />
      <div className="HeaderInspection-content">
        <h1>What is Header Inspection</h1>
        <p>
          Header Inspection involves the examination of various HTTP headers sent between
          the client (browser) and the server to enhance the security of web applications.
          These headers can convey important security policies and information to browsers,
          helping mitigate risks and protect against various attacks.
        </p>
        <p>
          Examples of headers include Content Security Policy (CSP), Strict-Transport-Security
          (HSTS), and X-Content-Type-Options. By inspecting and configuring these headers
          appropriately, developers can bolster the overall security posture of their web
          applications and reduce the likelihood of certain vulnerabilities.
        </p>
        <h5>Headers</h5>
        <div id="headers">
          {Object.entries(headers).map(([key, value], index) => (
            <p key={index}>{key}: {value}</p>
          ))}
        </div>
        <h5>Potential Security Risks</h5>
        <div id="risks">
          {risks.map((risk, index) => (
            <p key={index}>{risk}</p>
          ))}
        </div>
      </div>
      <div>
    </div>
    </div>
  );
}

export default HeaderInspection;
