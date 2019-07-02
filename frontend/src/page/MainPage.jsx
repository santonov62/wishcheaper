import React from 'react';
import {Image, Form, Dropdown, Icon, Button} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './mainPage.css';
import {connect} from 'react-redux';
import SignInWithVkButton from '../component/SignInWithVkButton';
import {authWithVk, signOut} from "../actionCreators/user.actionCreators";

const MainPage = ({ signedIn, signInHandler, user }) => (
  <div className='mainPage'>
    <div className='statistic'>

      <div className='title'>Покупайте любимые товары дешевле</div>
      <div className='stats'>
        <div className='number'>
          <div className='decorHeader'>1234</div>
          отслеживаемых товаров
        </div>
        <div className='number'>
          <div className='decorHeader'>15</div>
          Новых за месяц
        </div>
        <div className='number'>
          <div className='decorHeader'>468</div>
          Пользователей
        </div>
      </div>
      <br/>
      < br />
      {!user.id &&
        <SignInWithVkButton size='massive' text='Авторизироваться'/>
      }
    </div>
  </div>
);

export default connect(
  state => ({
    user: state.user
  }),
  dispatch => ({
    signInHandler: (session) => dispatch(authWithVk(session)),
    signOutHandler: () => dispatch(signOut()),
  }))(MainPage);
