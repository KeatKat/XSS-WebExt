// src/App.js
import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Context } from "./context";
import { useState, useEffect } from "react";
import Login from './Login';
import Signup from './Signup';
import Logon from './Logon';
import ViewProfile from './viewProfile';
import ReflectedXSS from './ReflectedXSS';
import DOMXSS from './DOMXSS';
import AntiCSRF from './AntiCSRF';
import LibraryValidation from './LibraryValidation';
import HeaderInspection from './HeaderInspection';
import Report from './report';


function App() {
  const [loginUser, setLoginUser] = useState(null);
  useEffect(()=>{
    const user = sessionStorage.getItem("user_id");
    if (user) {
      setLoginUser(JSON.parse(user));
    }
  }, []);
  return (
    <Context.Provider value={[loginUser, setLoginUser]}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Logon />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/viewProfile" element={<ViewProfile />}/>
            <Route path="/RXSS" element={<ReflectedXSS />} />
            <Route path="/DOMXSS" element={<DOMXSS />} />
            <Route path="/ACSRF" element={<AntiCSRF />} />
            <Route path="/JSLIB" element={<LibraryValidation />} />
            <Route path="/HEADERINSP" element={<HeaderInspection />} />
            <Route path="/REPORT" element={<Report />} />
            
            
          </Routes>
        </div>
      </Router>
    </Context.Provider>
  );
}

export default App;
