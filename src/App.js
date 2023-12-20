// src/App.js
import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { ContextProvider } from "./context";
import { Context } from "./context";
import { useContext } from "react";
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
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/logon" element={<Logon />} />
            <Route path="/viewProfile" element={<ViewProfile />}/>
            <Route path="/RXSS" element={<ReflectedXSS />} />
            <Route path="/DOMXSS" element={<DOMXSS />} />
            <Route path="/ACSRF" element={<AntiCSRF />} />
            <Route path="/JSLIB" element={<LibraryValidation />} />
            <Route path="/HEADERINSP" element={<HeaderInspection />} />
            
            
          </Routes>
        </div>
      </Router>
    </Context.Provider>
  );
}

export default App;
