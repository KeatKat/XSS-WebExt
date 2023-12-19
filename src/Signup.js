// src/Signup.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CSS/Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullname: '',
    email: '',
  });
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Add state for button disable
  const navigate = useNavigate(); // React Router hook for navigation

  useEffect(() => {
    // Redirect to login page after 3 seconds if the user signed up successfully
    let timeout;
    if (isSubmitted) {
      timeout = setTimeout(() => {
        navigate('/');
      }, 3000);
    }

    return () => clearTimeout(timeout); // Clear timeout on component unmount or dependency change
  }, [isSubmitted, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    // Enable the button only if all fields have input
    setIsButtonDisabled(Object.values(formData).some((val) => val.trim() === ''));
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
      console.log('Request Payload:', JSON.stringify({
        action: 'signup',
        ...formData,
      }));
      
      const response = await fetch('http://localhost:8081/signup', {
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
      console.log(result);

      if (result.status === "success") {
        setIsSubmitted(true);
        // Handle successful signup, e.g., redirect to another page
      } else {
        setErrorMessages({ signup: result.message });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessages({ signup: 'An error occurred. Please try again later. potato' });
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
      <form onSubmit={handleSubmit} onChange={handleChange}>
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
            name="fullname"
            value={formData.fullname}
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
          <input
            type="submit"
            value="Sign Up"
            disabled={isButtonDisabled}
          />
        </div>
      </form>
    </div>
  );

  return (
    <div className="signup-form">
      <div className="title">Sign Up</div>
      {isSubmitted ? (
        <div>
          User is successfully signed up.<br></br>
          Redirecting to login page in 3 seconds...
        </div>
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
