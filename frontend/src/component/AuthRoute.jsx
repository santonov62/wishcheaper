import React, {Fragment} from 'react';
import { Redirect, Route } from 'react-router-dom';
import UserContext from '../context/UserContext';

const AuthRoute = ({component: Component, children,  ...rest}) => (
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
          if (hasAccess){
            return !!Component
                ? <Component {...props} />
                : <Fragment>{children}</Fragment>;
          } else if (!withoutRedirect) {
            return redirect;
          }
          return '';
        } catch (e) {
          console.error(e.message);
          return redirect;
        }
      }}/>
    )}

  </UserContext.Consumer>
);

export default AuthRoute;