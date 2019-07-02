import React, {Fragment} from 'react';
import {Icon, Image, Header, Button, Label, Item} from 'semantic-ui-react';
import moment from 'moment';
import {connect} from 'react-redux';
import './goodItem.css';

const isGoodInvalid = ({title, price, url}) => {
  const isGoodValid = !!title && !!price && !!url;
  return !isGoodValid;
};

export const GoodItem = ({id, url, title, logo, price, old_price, shop_id,
                           updated_at, created_at, inactive_at, prev_price}) => {
  const invalidGoodProps = {id, url, updated_at, created_at, inactive_at};

  const isValid = isGoodInvalid({url, title, price});
  if (isValid) {
    return <InvalidGoodItem {...invalidGoodProps}/>;
  }
  const diffPrice = !!old_price && price - old_price;
  const diffPrevPrice = !!prev_price && price - prev_price;

  const isInactive = !!inactive_at;
  return (
    <Item className={`goodItem ${isInactive ? 'inactive' : ''}`}>
      <Item.Image className='logo' size='tiny' src={logo}/>
  
  
      <Item.Content>
        <Item.Header as='a' href={url} target='_blank'>
          {title}
        </Item.Header>

        <Item.Meta>
          {!!old_price && <span><strike>{old_price}₽</strike> -> </span>}
          <span>{price} ₽</span>
          
          {!!diffPrevPrice &&
              <Fragment>
                <Label as='a' color={diffPrevPrice > 0 ? 'red' : 'green'}>
                  {diffPrevPrice > 0 && '+'}{diffPrevPrice} ₽
                </Label>
              </Fragment>
          }
          {/*{(!diffPrice || !diffPrevPrice) &&*/}
          
          {/*}*/}
        </Item.Meta>
      </Item.Content>
    </Item>
  )
};

const InvalidGoodItem = ({id, url, title, logo, price, old_price, shop_id,
                           updated_at, created_at, inactive_at}) => {
  return (
    <Item className='goodItem invalid'>
      <Item.Image className='logo' size='tiny'>
        <Icon size='huge' name='ban' />
      </Item.Image>

      <Item.Content>
        <Item.Header as='a' href={url} target='_blank'>{url}</Item.Header>
      </Item.Content>
    </Item>
  )
};