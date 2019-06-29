import React from 'react';
import { Menu, Image, Icon, Input } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './header.css';
import ProfileButton from '../ProfileButton';
import {authHeader} from "../../helpers/auth-header";
import { connect } from 'react-redux';
import * as Constants from "../../constants";

class Header extends React.Component {
  state = {
    activeItem: 'main',
    value: '',
    isLoading: false
  };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };
  handleChange = (e, { name, value }) => {
    this.setState({ value });
  };
  addUrl = () => {
    const {value} = this.state;
    this.setState({isLoading: true});
    fetch(`checker/add`, {
      method: 'POST',
      body: JSON.stringify({
        url: value
      }),
      headers: {
        ...Constants.REQUEST_JSON_HEADERS,
        ...authHeader(this.props.user)
      }
    })
      .then(res => res.json())
      .then(good => {
        this.setState({
          value: '',
          isLoading: false
        });
      })
  };
  render() {
    const { activeItem, value, isLoading } = this.state;

    return (
      <Menu inverted className='headerMenu'>

        <Menu.Item
          name='main'
          as={Link}
          to="/"
          active={activeItem === 'main'}
          onClick={this.handleItemClick}>
          <Image src='/images/logo.png' size='mini' />
        </Menu.Item>

        <Menu.Item
          name='promos'
          as={Link}
          to="/promos"
          active={activeItem === 'list'}
          onClick={this.handleItemClick}>
          Мои товары
        </Menu.Item>

        <Menu.Item style={{display: 'flex', flexGrow: 1}}>
          <Input
            loading={isLoading}
            value={value}
            name='value'
            icon={<Icon name='add' link onClick={this.addUrl}/>}
            placeholder='Товар или ссылку для отслеживания...'
            onChange={this.handleChange}/>
        </Menu.Item>


        <Menu.Menu position='right'>
          <ProfileButton/>
        </Menu.Menu>

      </Menu>
    )
  }
}
export default connect(({user}) => ({user}))(Header);

