// src/App.js
import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Logon from './Logon';
import ReflectedXSS from './ReflectedXSS';


function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logon" element={<Logon />} />
          <Route path="/RXSS" element={<ReflectedXSS/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
