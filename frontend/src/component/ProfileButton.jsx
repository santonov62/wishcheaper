import React, { Fragment } from 'react';
import VkButton from './SignInWithVkButton';
import UserPic from './UserPic';
import { connect } from 'react-redux';
import { authWithVk, signOut } from '../actionCreators/user.actionCreators';
import { Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const ProfileButton = ({ id, name, photo, signInHandler, signOutHandler, isAdmin }) => {
  if (!id) {
    return (
      <Dropdown item icon='sign in' simple>
        <Dropdown.Menu pointing='bottom right'>
          <Dropdown.Header>Войти</Dropdown.Header>
          <Dropdown.Divider/>
          <Dropdown.Item>
            <VkButton signInHandler={signInHandler} text='Вконтакте'/>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }
  const picture = <UserPic pic={photo}/>;
  return (
    <Dropdown item icon={picture} simple>
      <Dropdown.Menu pointing='bottom right'>
        <Dropdown.Header>{name}</Dropdown.Header>
        {
          isAdmin &&
          <Fragment>
            <Dropdown.Divider/>
            <Dropdown.Item as={Link} to='/scanner'>Сканер</Dropdown.Item>
          </Fragment>
        }
        <Dropdown.Divider/>
        {/*<Dropdown.Item as={Link} to='/user/promos'>Мои промокоды</Dropdown.Item>*/}
        <Dropdown.Item onClick={signOutHandler}>Выйти</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};


export default connect(
  state => ({
    id: state.user.id,
    isAdmin: !!state.user.admin,
    name: state.user.name,
    photo: state.user.photo,
  }),
  dispatch => ({
    signInHandler: (session) => dispatch(authWithVk(session)),
    signOutHandler: () => dispatch(signOut()),
  }))(ProfileButton);
