import React from 'react';
import { Menu, Image, Icon, Input, Segment, List, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ProfileButton from '../ProfileButton';
import { connect } from 'react-redux';

class Footer extends React.Component {
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
        <Segment inverted textAlign='center'>
          <br />
          <br />
          <List divided horizontal inverted>
            <List.Item>
              <List.Content>
                <Icon name='copyright outline' /> 2019
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <Icon name='help circle' /> Помощь
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <a target='_blank' href='https://vk.com/club183983399'><Icon name='vk' /> Мы вконтакте</a>
              </List.Content>
            </List.Item>
          </List>
          <br />
          <br />
          <br />
          
        </Segment>
    )
  }
}
export default Footer;

