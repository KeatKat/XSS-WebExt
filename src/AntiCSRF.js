import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './CSS/AntiCSRF.css';

function AntiCSRF() {
  
  return (
    <div className="AntiCSRF-page">
      <Sidebar />
      <div className="AntiCSRF-content">
        <h1>What is Anti Cross-Site Request Forgery (Anti-CSRF)</h1>
        <p>
          Anti Cross-Site Request Forgery (Anti-CSRF) is a security measure designed to
          protect web applications from unauthorized, malicious actions performed on behalf
          of an authenticated user. CSRF attacks exploit the trust that a web application has
          in a user's browser by tricking it into making unintended, malicious requests.
        </p>
        <p>
          To prevent CSRF attacks, web developers implement Anti-CSRF tokens, unique and
          unpredictable values embedded in forms or requests. These tokens validate the
          authenticity of each request, ensuring that they originated from the legitimate
          user and not from a malicious source.
        </p>
      </div>
    </div>
  );
}

export default AntiCSRF;
