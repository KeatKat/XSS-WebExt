// Logon.js
import React from 'react';
import Sidebar from './Sidebar';
import './CSS/Logon.css';

function Logon() {
  return (
    <div className="logon-page">
      <Sidebar />
      <div className="logon-content">
        {/* Logon content goes here */}
        <h1>Welcome to Logon Page</h1>
      </div>
    </div>
  );
}

export default Logon;
