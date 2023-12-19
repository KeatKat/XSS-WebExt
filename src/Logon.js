// Logon.js
import React from 'react';
import Sidebar from './Sidebar';
import './CSS/Logon.css';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from "./context";
import { useContext } from "react";

const LogOn = () => {
  const navigate = useNavigate(); 
  const [loginUser, setLoginUser] = useContext(Context);
  const logOut = () => {
    setLoginUser(null);
    navigate("/")
    sessionStorage.removeItem("user_id");
  }

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

export default LogOn;
