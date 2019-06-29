import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import UserContext from '../context/UserContext';

const AuthRoute = ({component: Component, ...rest}) => (
  <UserContext.Consumer>
    {user => (
      <Route {...rest} render={props => {
        const redirect = <Redirect to={{pathname: '/', state: {from: props.location}}}/>;
        try {
          const isAdminRequired = rest.adminRequired;
          const {withoutRedirect} = rest;
          const isAdmin = !!user.admin;
          const signedIn = !!user.id;
          const hasAccess = isAdminRequired ? isAdmin : signedIn;
          return hasAccess
            ? <Component {...props} /> : !withoutRedirect ? redirect : ''
        } catch (e) {
          console.error(e.message);
          return redirect;
        }
      }
      }/>
    )}

  </UserContext.Consumer>
);

export default AuthRoute;