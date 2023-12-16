// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const handleToggle = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
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
      </ul>  
    </div>
  );
}

export default Sidebar;
