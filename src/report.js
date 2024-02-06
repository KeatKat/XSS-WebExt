import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './CSS/Report.css';

function Report() {
  const [containRXSS, setContainRXSS] = useState(false);
  const [containDOMXSS, setContainDOMXSS] = useState(false);

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




  return (
    <div className='report-page'>
      <Sidebar />
      <div className='report-content'>
        <h1>Consolidated report and risk score</h1>
        <p>{containRXSS ? 'Potential XSS detected!' : 'No potential XSS detected.'}</p>
        <p>{containDOMXSS ? 'Potential DOM-based XSS detected!' : 'No DOM-based XSS detected'}</p>
      </div>
    </div>
  );
}

export default Report;
