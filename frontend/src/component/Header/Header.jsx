import React from 'react';
import { Menu, Image, Icon, Input } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './header.css';
import ProfileButton from '../ProfileButton';
import { connect } from 'react-redux';
import AddGoodField from '../Goods/AddGoodField';

class Header extends React.Component {
  state = {
    activeItem: 'main',
    value: '',
    isLoading: false
  };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
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
          name='mylist'
          as={Link}
          to="/mylist"
          active={activeItem === 'list'}
          onClick={this.handleItemClick}>
          &nbsp;&nbsp;&nbsp;<Icon size='large' name='favorite'/>
          {/*Мои товары*/}
        </Menu.Item>

        <Menu.Item style={{display: 'flex', flexGrow: 1}}>
          <AddGoodField />
        </Menu.Item>


        <Menu.Menu position='right'>
          <ProfileButton/>
        </Menu.Menu>

      </Menu>
    )
  }
}
export default Header;

