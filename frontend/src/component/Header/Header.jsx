import React, {Fragment} from 'react';
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
      <Fragment>
        <div className="headerBackground" />
          <Menu fixed='top' inverted className='headerMenu'>

            {/*<Menu.Item*/}
              {/*name='main'*/}
              {/*as={Link}*/}
              {/*to="/"*/}
              {/*active={activeItem === 'main'}*/}
              {/*onClick={this.handleItemClick}>*/}
              {/*<Image src='/images/logo.png' size='mini' />*/}
            {/*</Menu.Item>*/}

            <Menu.Item
              name='my'
              as={Link}
              to="/my"
              active={activeItem === 'list'}
              onClick={(e, opts) => {
                // this.handleItemClick(e, opts);
                window.location.href = `/my`;
              }}>
              {/*&nbsp;&nbsp;&nbsp;<Icon color='yellow' size='large' name='favorite'/>*/}
              <Image src='/images/logo.png' size='mini' />
              {/*Мои товары*/}
            </Menu.Item>

            <Menu.Item className='addGoodItem' style={{display: 'flex', flexGrow: 1, padding: 5}}>
              <AddGoodField />
            </Menu.Item>


            <Menu.Menu position='right'>
              <ProfileButton/>
            </Menu.Menu>

          </Menu>
      </Fragment>
    )
  }
}
export default Header;

