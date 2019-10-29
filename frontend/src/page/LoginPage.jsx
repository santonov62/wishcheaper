import React from 'react';
import { Header } from 'semantic-ui-react';
import SignInWithVkButton from '../component/SignInWithVkButton';
import './loginPage.css';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const LoginPage = ({ signedIn, signInHandler }) => {
  if (signedIn) {
    return <Redirect to={{ pathname: '/' }}/>;
  }

  return (
      <div className='loginPage'>
        <Header as='h1'>Авторизируйтесь</Header>
        <SignInWithVkButton size='huge' text='Вконтакте' signInHandler={signInHandler}/>
      </div>
  )
};

const mapState = (state) => ({
  signedIn: !!state.user.id
});

export default connect(mapState)(LoginPage);
