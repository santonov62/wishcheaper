import React from 'react';
import UserContext from '../context/UserContext';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const UserContextProvider = ({ user, children }) => (
  <UserContext.Provider value={user}>
    {children}
  </UserContext.Provider>
);

const mapState = (state) => ({
  user: state.user
});

const connected = connect(mapState)(UserContextProvider);
export default withRouter(connected);