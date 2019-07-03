import React, {Fragment} from 'react';
import {Image, Form, Dropdown, Icon, Button} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './mainPage.css';
import {connect} from 'react-redux';
import SignInWithVkButton from '../component/SignInWithVkButton';
import {authWithVk, signOut} from "../actionCreators/user.actionCreators";

class MainPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      goods_count: 0,
      month_goods_count: 0,
      users_count: 0
    }
  }
  componentDidMount() {
    fetch(`/goods/statistic`)
      .then(res => res.json())
      .then(statistic => this.setState({...statistic}));
  }
  render() {
    const {user} = this.props;
    const {goods_count, month_goods_count, users_count} = this.state;
    return (
      <div className='mainPage'>
        <div className='statistic'>

          <div className='title'>Покупайте любимые товары дешевле</div>
          <div className='stats'>
            <div className='number'>
              <div className='decorHeader'>{goods_count}</div>
              отслеживаемых товаров
            </div>
            <div className='number'>
              <div className='decorHeader'>{month_goods_count}</div>
              Новых за месяц
            </div>
            <div className='number'>
              <div className='decorHeader'>{users_count}</div>
              Пользователей
            </div>
          </div>
          {!user.id &&
          <Fragment>
            <br/>
            <br/>
            <SignInWithVkButton size='massive' text='Авторизироваться'/>
          </Fragment>
          }
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    user: state.user
  }),
  dispatch => ({
    signInHandler: (session) => dispatch(authWithVk(session)),
    signOutHandler: () => dispatch(signOut()),
  }))(MainPage);
