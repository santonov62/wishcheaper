import React, {Fragment} from 'react';
import {Icon, Loader, Image, Message, Header, Dimmer, Button, Divider, Label, Item, Dropdown, Modal, TextArea, Checkbox, Radio, Form, Input, Select} from 'semantic-ui-react';
import {removeGood, userGoods} from '../../actionCreators/goods.actionCreators'
import moment from 'moment';
import {connect} from 'react-redux';
import './goodItem.css';
import GoodMenu from './GoodMenu';

const isGoodInvalid = ({title, price, url}) => {
  const isGoodValid = !!title && !!price && !!url;
  return !isGoodValid;
};

export const GoodItem = ({id: good_id, url, title, logo, price, old_price, shop_id, shop_name,
                           updated_at, created_at, inactive_at, prev_price, subscription_id,
                           price_discount, percent_discount}) => {
  
  const invalidGoodProps = {good_id, url, updated_at, created_at, inactive_at};
  const goodMenuProps = {direction: 'left', good_id, subscription_id};
  
  const isValid = isGoodInvalid({url, title, price});
  if (isValid) {
    return <InvalidGoodItem {...invalidGoodProps} goodMenuProps={goodMenuProps}/>;
  }
  
  const diffPrevPrice = !!prev_price && price - prev_price;
  const isInactive = !!inactive_at;
  const updatedRange = moment(updated_at).fromNow(true);
  const updatedRangeText = `Актуально ${updatedRange} назад`;
  const percentDiscount = old_price ? 100 - price / (old_price / 100) : 0;
  const roundedPercentDiscount = Number((percentDiscount).toFixed());
  return (
      <Item className={`goodItem ${isInactive ? 'inactive' : ''}`}>
        
        <Item.Image className='logo' size='tiny' src={logo}>
          {percentDiscount > 0 &&
          <Label className='discount' size='large' circular>
            -{roundedPercentDiscount}%
          </Label>
          }
          <Image src={logo} />
        </Item.Image>
        
        <Item.Content>
  
          <GoodMenu {...goodMenuProps}/>
          
          <Item.Header as='a' href={url} target='_blank'>
            {title}
          </Item.Header>
          
          <Item.Meta>
            {!!old_price && <span><strike>{old_price}₽</strike> -> </span>}
            <span>{price} ₽</span>
            
            {!!diffPrevPrice &&
            <Fragment>
              <Label color={diffPrevPrice > 0 ? 'red' : 'green'}>
                {diffPrevPrice > 0 && '+ '}{diffPrevPrice} ₽
              </Label>
            </Fragment>
            }
            
          </Item.Meta>
          <Item.Extra>
            <Label floated='right' size='small'><Icon name='shop' />{shop_name}</Label>
            <Label size='small'><Icon name='history' />{updatedRangeText}</Label>
            {!!price_discount &&
              <Label color='orange' size='small'><Icon name='bell outline' />{price_discount} ₽</Label>
            }
            {!!percent_discount &&
              <Label color='orange' size='small'><Icon name='bell outline' />{percent_discount} %</Label>
            }
          </Item.Extra>
        </Item.Content>
      </Item>
  )
};

const InvalidGoodItem = ({good_id, url, goodMenuProps}) => {
  return (
    <Item className='goodItem invalid'>
      <Item.Image className='logo' size='tiny'>
        <Icon size='huge' name='ban' />
      </Item.Image>

      <Item.Content>
        <GoodMenu {...goodMenuProps}/>
        <Item.Header as='a' href={url} target='_blank' style={{
          overflow: 'hidden',
          maxWidth: 300,
          textOverflow: 'ellipsis'
        }}>{url}</Item.Header>
      </Item.Content>
    </Item>
  )
};