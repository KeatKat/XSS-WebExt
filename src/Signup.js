// src/Signup.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
  });
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs
    if (Object.values(formData).some((value) => value.trim() === '')) {
      setErrorMessages({ validation: 'All fields must be filled.' });
      return;
    }

    // Fetch data from PHP backend
    try {
      const response = await fetch('http://localhost/useraccount.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'signup',
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'success') {
        setIsSubmitted(true);
        // Handle successful signup, e.g., redirect to another page
      } else {
        setErrorMessages({ signup: result.message });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessages({ signup: 'An error occurred. Please try again later.' });
    }
  };

  const renderErrorMessage = (name) =>
    errorMessages[name] && <div className="error">{errorMessages[name]}</div>;



   const renderBackToLoginLink = (
        <div className="back-to-login-link">
            <Link to="/">Back to Login</Link>
        </div>
        );

    
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-container">
          <label>Password </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-container">
          <label>Full Name </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-container">
          <label>Email </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="button-container">
          <input type="submit" value="Sign Up" />
        </div>
      </form>
    </div>
  );

  return (
    <div className="signup-form">
      <div className="title">Sign Up</div>
      {isSubmitted ? (
        <div>User is successfully signed up</div>
      ) : (
        <>
          {renderErrorMessage('signup')}
          {renderForm}
          {renderBackToLoginLink}
        </>
      )}
    </div>
  );
}

export default Signup;
