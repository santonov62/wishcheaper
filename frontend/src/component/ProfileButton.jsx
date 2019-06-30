import React, { Fragment } from 'react';
import VkButton from './SignInWithVkButton';
import UserPic from './UserPic';
import { connect } from 'react-redux';
import { authWithVk, signOut } from '../actionCreators/user.actionCreators';
import { Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class ProfileButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVkWidgetInited: false
    }
  }
  initVkWidget = () => {
    const vk = window.VK;
    const vk_community_id = process.env.REACT_APP_VK_COMMUNITY_ID;
    vk.Widgets.AllowMessagesFromCommunity("vk_allow_messages_from_community", {height: 30}, vk_community_id);
    this.setState({isVkWidgetInited: true});

    const message = `Изменилась цена на товар`;
    return fetch(`https://api.vk.com/method/messages.send`, {
      method: 'POST',
      payload: {
        message,
        user_ids: 2758589,
        access_token: `2ecc890bce9d8ce27b17c06bf4e8dc40f5785c44d43abceaa8cc44d2172495de4cada705c73c2d5bd6461`,
        v: '5.87'
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => res.json())
      .then((json) => {
        const {error} = json;
        if (!!error)
          throw new Error(error.error_msg);
      });

  };
  render() {
    const { id, name, photo, signInHandler, signOutHandler, isAdmin, isApiInited } = this.props;
    const { isVkWidgetInited } = this.state;
    if (isApiInited && !isVkWidgetInited)
      this.initVkWidget();
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
          <Dropdown.Item>
            <div id="vk_allow_messages_from_community" style={{minWidth: 190}}/>
          </Dropdown.Item>
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
  }
}
// const ProfileButton = ({ id, name, photo, signInHandler, signOutHandler, isAdmin }) => {
//   if (!id) {
//     return (
//       <Dropdown item icon='sign in' simple>
//         <Dropdown.Menu pointing='bottom right'>
//           <Dropdown.Header>Войти</Dropdown.Header>
//           <Dropdown.Divider/>
//           <Dropdown.Item>
//             <VkButton signInHandler={signInHandler} text='Вконтакте'/>
//           </Dropdown.Item>
//         </Dropdown.Menu>
//       </Dropdown>
//     )
//   }
//   const picture = <UserPic pic={photo}/>;
//   return (
//     <Dropdown item icon={picture} simple>
//       <Dropdown.Menu pointing='bottom right'>
//         <Dropdown.Header>{name}</Dropdown.Header>
//         <Dropdown.Item>
//           <div id="vk_allow_messages_from_community" />
//         </Dropdown.Item>
//         {
//           isAdmin &&
//           <Fragment>
//             <Dropdown.Divider/>
//             <Dropdown.Item as={Link} to='/scanner'>Сканер</Dropdown.Item>
//           </Fragment>
//         }
//         <Dropdown.Divider/>
//         {/*<Dropdown.Item as={Link} to='/user/promos'>Мои промокоды</Dropdown.Item>*/}
//         <Dropdown.Item onClick={signOutHandler}>Выйти</Dropdown.Item>
//       </Dropdown.Menu>
//     </Dropdown>
//   );
// };


export default connect(
  state => ({
    id: state.user.id,
    isAdmin: !!state.user.admin,
    name: state.user.name,
    photo: state.user.photo,
    isApiInited: state.vk.isApiInited
  }),
  dispatch => ({
    signInHandler: (session) => dispatch(authWithVk(session)),
    signOutHandler: () => dispatch(signOut()),
  }))(ProfileButton);
