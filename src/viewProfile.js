import React, { useContext } from 'react';
import { Context } from './context';
import Sidebar from './Sidebar';
import './CSS/viewProfile.css';
import ProfileImage from './Images/ProfilePic.jpg';
const ViewProfile = () => {
  const [loginUser, setLoginUser] = useContext(Context);

  return (
    <div className='profile-page'>
      <Sidebar />
      <div className='profile-content'>
        <h2>Profile Information</h2>
        <div className="profile-details">
          <div className="profile-image">
            <img src={ProfileImage} alt="Profile" />
          </div>
          <div className="profile-info">
            {loginUser ? (
              <div>
                <p>Welcome, {loginUser.username}!</p>
                <p>Email: {loginUser.email}</p>
              </div>
            ) : (
              <p>Please log in to view your profile.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;
