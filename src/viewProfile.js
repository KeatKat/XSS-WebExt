import React, { useContext } from 'react';
import { Context } from './context';
import Sidebar from './Sidebar';
import './CSS/viewProfile.css';

function ViewProfile() {
  const [loginUser, setLoginUser] = useContext(Context);
  return (
    <div className='profile-page'>
      <Sidebar />
      <div className='profile-content'>
        <h2>Profile Information</h2>
        {loginUser ? (
          <div>
            
            <p>{loginUser.username}</p> 

          </div>
        ) : (
          <p>Please log in to view your profile.</p>
        )}
      </div>
    </div>
  );
}

export default ViewProfile;
