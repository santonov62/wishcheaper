import React, { Fragment } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import UserContext from '../context/UserContext';

const AuthRoute = ({ children, adminRequired }) => {
  const location = useLocation();

  return (
    <UserContext.Consumer>
      {user => {
        const isAdmin = !!user.admin;
        const signedIn = !!user.id;
        const hasAccess = adminRequired ? isAdmin : signedIn;

        if (hasAccess) {
          return children;
        }

        return <Navigate to="/login" state={{ from: location }} replace />;
      }}
    </UserContext.Consumer>
  );
};

export default AuthRoute;
