import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './CSS/DOMXSS.css';

function DOMXSS() {
  
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
      </div>
    </div>
  );
}

export default DOMXSS;
