import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './CSS/PreCheckURL.css';

const PreCheckURL = () => {
  const [url, setURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheckURL = () => {
    setLoading(true);
    let resultMessage = '';
    let isSafe = true;

    // Simulate an asynchronous operation
    setTimeout(() => {
      if (url === 'www.google.com') {
        resultMessage = 'No vulnerabilities detected for www.google.com';
        isSafe = true;
      } else if (url === 'www.example.free.beeceptor.com/<script>alert("XSS attack");</script>') {
        resultMessage = 'Potential reflected cross-site scripting detected';
        isSafe = false;
      } else if (url === 'www.example.free.beeceptor.com/DOM') {
        resultMessage = 'Potential DOM-based cross-site scripting detected';
        isSafe = false;
      } else {
        resultMessage = 'Unable to check URL. Unknown domain.';
        isSafe = false;
      }
      
      setLoading(false);
      setResult({ message: resultMessage, safe: isSafe });
    }, 2000);
  };

  return (
    <div className='precheckurl-page'>
      <Sidebar />
      <div className='precheckurl-content'>
        <h2>URL CHECK</h2>
        <div className="url-input-container">
          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setURL(e.target.value)}
          />
          <button onClick={handleCheckURL}>Check URL</button>
        </div>
        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
        {!loading && result && (
          <div className="result-container">
            <p>{result.message}</p>
            <div className={`safety-indicator ${result.safe ? 'safe' : 'unsafe'}`}>
              {result.safe ? 'Safe' : 'Unsafe'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PreCheckURL;
