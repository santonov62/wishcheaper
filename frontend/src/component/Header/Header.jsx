import React from 'react';
import { Menu, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './header.css';
import ProfileButton from '../ProfileButton';

export default class Header extends React.Component {
  state = {
    activeItem: 'main'
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

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

        <Menu.Menu position='right'>
          <ProfileButton/>
        </Menu.Menu>

      </Menu>
    )
  }
}
