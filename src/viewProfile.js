import React, { useContext } from 'react';
import { Context } from './context';
import Sidebar from './Sidebar';

function ViewProfile() {
  const [loginUser, setLoginUser] = useContext(Context);
  return (
    <div>
      <h2>Profile Information</h2>
      {loginUser ? (
        <div>
          <Sidebar />
          <p>{loginUser.username}</p> 

        </div>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
}

export default ViewProfile;
