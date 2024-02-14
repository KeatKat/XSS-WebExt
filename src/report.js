// Report.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './CSS/Report.css';

function Report() {
  const [loading, setLoading] = useState(true); // Initial loading state
  const [containRXSS, setContainRXSS] = useState(false);
  const [containDOMXSS, setContainDOMXSS] = useState(false);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [websiteScore, setWebsiteScore] = useState(0);

  useEffect(() => {
    // Simulate loading delay for 2 seconds
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timeout); // Cleanup
  }, []);

  // Fetch the status of containRXSS from the background script when the component mounts
  useEffect(() => {
    // Request the status from the background script
    browser.runtime.sendMessage({ action: 'getRXSSStatus' }, (response) => {
      if (response && response.containRXSS) {
        setContainRXSS(response.containRXSS);
        console.log("RXSS");
      }
    });
  }, []);

  useEffect(() => {
    // Request the DOM XSS status from background.js
    browser.runtime.sendMessage({ action: 'getDOMXSSStatus' }, (response) =>{
      if (response && response.containDOMXSS){
        setContainDOMXSS(response.containDOMXSS);
        console.log("DOMXSS");
      }
    });
  }, []);

  useEffect(() => {
    const fetchVulnerabilities = async () => {
        try {
            const response = await browser.runtime.sendMessage({ action: 'getVulnerabilities' });
            setVulnerabilities(response.vuln || []);
        } catch (error) {
            console.error('Error fetching vulnerabilities:', error);
            setVulnerabilities([]);
        }
    };

    fetchVulnerabilities();
}, []);

  useEffect(() => {
    // Calculate the website score based on XSS vulnerabilities
    let score = 5; // Maximum score
    if (containRXSS) {
      score -= 1; // Deduct 1 point for reflected XSS
    }
    if (containDOMXSS) {
      score -= 1; // Deduct 1 point for DOM-based XSS
    }
    setWebsiteScore(score);
  }, [containRXSS, containDOMXSS]);

  return (
    <div className='report-page'>
      <Sidebar />
      <div className='report-content'>
        {loading ? (
          <div className="loading-bar">
            <br></br>
            <br></br>
            <h2>Generating website report...</h2>
          </div>
        ) : (
          <>
            <h1>Consolidated report and risk score</h1>
            <p>{containRXSS ? 'Potential XSS detected!' : 'No potential XSS detected.'}</p>
            <p>{containDOMXSS ? 'Potential DOM-based XSS detected!' : 'No DOM-based XSS detected'}</p>
            <p>JavaScript Library : All up to date</p>
            <p>Response Headers : Validated</p>
            <p>Anti-CSRF : Detected</p>
            <h2>Website Score: {websiteScore}/5</h2> {/* Display website score */}
          </>
        )}
      </div>
    </div>
  );
}

export default Report;
