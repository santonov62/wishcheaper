import React from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

const AuthRoute = ({ children, adminRequired }) => {
  return (
    <UserContext.Consumer>
      {user => {
        const isAdmin = !!user.admin;
        const signedIn = !!user.id;
        const hasAccess = adminRequired ? isAdmin : signedIn;

        if (hasAccess) {
          return children;
        }

        return <Navigate to="/" replace />;
      }}
    </UserContext.Consumer>
  );
};

export default AuthRoute;
