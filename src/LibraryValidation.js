import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './CSS/LibraryValidation.css';
import DOMPurify from 'dompurify';

function LibraryValidation() {
  const [url, setUrl] = useState('');
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  // Helper function to extract vulnerabilities from the response data
  const extractVulnerabilities = (text) => {
    const jsLibraryPattern = /\b([a-zA-Z0-9_\-]+)@([0-9]+\.[0-9]+\.[0-9]+)\b/;
    const match = text.match(jsLibraryPattern);
    if (match) {
      return `${match[1]}@${match[2]}`;
    }
    return 'No vulnerable libraries';
  };

  // Function to check vulnerabilities
  const checkVulnerabilities = async (url) => {
    setIsChecking(true);
    try {
      const response = await fetch('http://localhost:8081/checkVulnerabilities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      console.log(data);

      // Parse the response data to extract vulnerabilities
      var parsedVulnerabilities = JSON.stringify(data.stdout);
      setVulnerabilities(extractVulnerabilities(parsedVulnerabilities));
    } catch (error) {
      console.error('Error checking vulnerabilities:', error);
      setVulnerabilities([]);
    } finally {
      setIsChecking(false);
    }
  };

  // Automatically get the current tab's URL and check vulnerabilities
  useEffect(() => {
    const getCurrentTabUrlAndCheckVulnerabilities = async () => {
      const queryOptions = { active: true, currentWindow: true };
      const [tab] = await browser.tabs.query(queryOptions);
      if (tab.url) {
        setUrl(tab.url);
        checkVulnerabilities(tab.url);
      }
    };
    getCurrentTabUrlAndCheckVulnerabilities();
  }, []);

  return (
    <div className="LibraryValidation-page">
      <Sidebar />
      <div className="LibraryValidation-content">
        <h1>What is Library Validation</h1>
        <p>
          Library Validation involves the assessment and verification of JavaScript
          libraries and frameworks used in web applications. It ensures that the chosen
          libraries are up-to-date, free of known vulnerabilities, and adhere to best
          practices for secure coding.
        </p>
        <p>
          Keeping libraries validated is crucial for maintaining the security and
          stability of web applications. Developers should regularly check for updates,
          review release notes for security patches, and consider using tools that
          automate the validation process to stay ahead of potential security risks.
        </p>
        {isChecking ? (
          <p>Checking vulnerabilities...</p>
        ) : (
          <div>
            <h2>URL: {url}</h2>
            {/*vulnerabilities.length > 0 ? (
              <div>
                <h3>Vulnerabilities Found:</h3>
                <ul>
                  {vulnerabilities.map((vul, index) => (
                    <li key={index}>
                      Library: {vul.library}, Count: {vul.count}, Link: <a href={vul.link} target="_blank" rel="noopener noreferrer">Details</a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No vulnerabilities found.</p>
            )*/}
            <p>Vulnerable libraries present: {DOMPurify.sanitize(vulnerabilities)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LibraryValidation;
