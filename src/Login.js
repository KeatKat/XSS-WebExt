// src/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CSS/Login.css';
import { Context } from "./context";
import { useContext } from "react";

function Login() {
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Add state for button disable
  const navigate = useNavigate(); // React Router hook for navigation
  const [loginUser, setLoginUser] = useContext(Context);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  /*const handleInputChange = (e) => { 
    //const username = document.forms[0].elements.username.value;
    //const password = document.forms[0].elements.password.value;
    setUsername(document.forms[0].elements.username.value);


    // Enable the button only if both fields have input
    setIsButtonDisabled(username === '' || password === '');
  };*/

  const handleUserChange = (e) => {
    setUsername(e.target.value);
    setIsButtonDisabled(username === '' || password === '');
  };

  const handlePassChange = (e) => {
    setPassword(e.target.value);
    setIsButtonDisabled(username === '' || password === '');
  };


  const handleSubmit = async (event) => {
    event.preventDefault();  

    //const username = event.target.elements.username.value;
    //const password = event.target.elements.password.value;

    // Fetch data from PHP backend
    try {
      const response = await fetch('http://localhost:8081/login', {
        method: 'POST',
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);

      }
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        setIsSubmitted(true);
        sessionStorage.setItem("user_id", JSON.stringify(data.user));
        setLoginUser(data.user);
        // Redirect to Logon page after successful login
        console.log(username);
        //getUser();
        navigate("/logon");
      } else {
        setErrorMessages({ login: response.message });
      } 

    } catch (error) {
      console.error('Error:', error);
      setErrorMessages({
        login: 'An error occurred. Please try again later.',
      });
    }
  };

  const renderErrorMessage = (name) =>
    errorMessages[name] && <div className="error">{errorMessages[name]}</div>;

  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="username" required onChange={handleUserChange}/>
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="password" required onChange={handlePassChange}/>
        </div>
        <div className="button-container">
          <input
            type="submit"
            value="Login"
            disabled={isButtonDisabled}
          />
        </div>
      </form>
    </div>
  );

  const renderSignupLink = (
    <div className="signup-link">
      New to SurfSafe? <Link to="/signup">Sign up here</Link>
    </div>
  );

  return (
    <div className="login-form">
      <div className="title">Log in</div>
      {isSubmitted ? (
        <div>User is successfully logged in</div>
      ) : (
        <>
          {renderErrorMessage('login')}
          {renderForm}
          {renderSignupLink}
        </>
      )}
    </div>
  );
}

export default Login;
