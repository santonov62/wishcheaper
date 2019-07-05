import React, {Fragment} from 'react';
import {Icon, Loader, Image, Message, Header, Dimmer, Button, Divider, Label, Item, Dropdown, Modal, TextArea, Checkbox, Radio, Form, Input, Select} from 'semantic-ui-react';
import {removeGood, userGoods} from '../../actionCreators/goods.actionCreators'
import moment from 'moment';
import {connect} from 'react-redux';
import './shopItem.css';

export const ShopItem = ({id, name, url, title, logo, updated_at, created_at}) => {

  return (
    <Item className='shopItem'>

      {/*<Item.Image className='logo' size='tiny' src={logo}>*/}
        {/*<Image src={logo} />*/}
      {/*</Item.Image>*/}

      <Item.Content>

        <Item.Header as='a' href={url} target='_blank'>
          {title}
        </Item.Header>

        <Item.Meta>
          {name}
        </Item.Meta>
        <Item.Extra>
          {url}

        </Item.Extra>
      </Item.Content>
    </Item>
  )
};