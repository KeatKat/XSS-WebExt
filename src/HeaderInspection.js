import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './CSS/HeaderInspection.css';

function HeaderInspection() {
  
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
      </div>
    </div>
  );
}

export default HeaderInspection;
