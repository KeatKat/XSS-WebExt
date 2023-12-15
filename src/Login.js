// src/Login.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Add state for button disable

  const handleInputChange = () => {
    const username = document.forms[0].elements.username.value;
    const password = document.forms[0].elements.password.value;

    // Enable the button only if both fields have input
    setIsButtonDisabled(username === "" || password === "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;


    // Fetch data from PHP backend
    try {
      const response = await fetch("http://localhost/useraccount.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "login",
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success") {
        setIsSubmitted(true);
        // Handle successful login, e.g., redirect to another page
      } else {
        setErrorMessages({ login: result.message });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessages({
        login: "An error occurred. Please try again later.",
      });
    }
  };

  const renderErrorMessage = (name) =>
    errorMessages[name] && <div className="error">{errorMessages[name]}</div>;

  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit} onChange={handleInputChange}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="username" required />
          {renderErrorMessage("validation")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="password" required />
          {renderErrorMessage("validation")}
        </div>
        <div className="button-container">
          <input
            type="submit"
            value="Login"
            disabled={isButtonDisabled} // Disable the button based on state
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
          {renderErrorMessage("login")}
          {renderForm}
          {renderSignupLink}
        </>
      )}
    </div>
  );
}

console.log("login.js");
export default Login;
