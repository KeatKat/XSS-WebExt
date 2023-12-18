// Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CSS/Sidebar.css';

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
        <li><Link to="/view-profile">View Profile</Link></li>
        <li onClick={handleThreatManagementToggle}>
          <a>Threat Management</a>
          {threatManagementOpen && (
            <ul className="submenu">
              <li><Link to="/RXSS">Reflected-XSS</Link></li>
              <li><Link to="/threat-management/option2">DOM-based XSS</Link></li>
              <li><Link to="/threat-management/option3">Anti-CSRF tokens</Link></li>
              <li><Link to="/threat-management/option4">JS libary validation</Link></li>
              <li><Link to="/threat-management/option5">Header Inspection</Link></li>
              <li><Link to="/threat-management/option6">Consolidation</Link></li>
            </ul>
          )}
        </li>
      </ul>  
    </div>
  );
}

export default Sidebar;
