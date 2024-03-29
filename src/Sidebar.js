// Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CSS/Sidebar.css';
import { Context } from "./context";
import { useContext } from "react";

function Sidebar() {
  const [threatManagementOpen, setThreatManagementOpen] = useState(false);

  const handleToggle = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
  };

  const handleThreatManagementToggle = () => {
    setThreatManagementOpen(!threatManagementOpen);
  };

  return (
    <div className="sidebar">
      <div className="menu-toggle" onClick={handleToggle}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className="menu">
        <li><Link to="/logon">Home</Link></li>
        <li><Link to="/viewProfile">View Profile</Link></li>
        <li><Link to="/PreCheckURL">Check URL</Link></li>
        <li onClick={handleThreatManagementToggle}>
          <a>Threat Management</a>
          {threatManagementOpen && (
            <ul className="submenu">
              <li><Link to="/RXSS">DOM-based XSS</Link></li>
              <li><Link to="/DOMXSS">Reflected-XSS</Link></li>
              <li><Link to="/ACSRF">Anti-CSRF tokens</Link></li>
              <li><Link to="/JSLIB">JS libary validation</Link></li>
              <li><Link to="/HEADERINSP">Header Inspection</Link></li>
              <li><Link to="/REPORT">Consolidation</Link></li>
            </ul>
          )}
        </li>
        <li><Link to="/Login">Login</Link></li>
      </ul>  
    </div>
  );
}

export default Sidebar;
