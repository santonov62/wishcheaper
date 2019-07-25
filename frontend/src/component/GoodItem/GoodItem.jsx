import React, {Fragment} from 'react';
import {Icon, Loader, Image, Message, Header, Dimmer, Card, Button, Divider, Label, Item, Dropdown, Modal, TextArea, Checkbox, Radio, Form, Input, Select} from 'semantic-ui-react';
import {removeGood, userGoods} from '../../actionCreators/goods.actionCreators'
import moment from 'moment';
import {connect} from 'react-redux';
import './goodItem.css';
import GoodMenu from './GoodMenu';

const isGoodValid = ({title, price, url}) => {
  return !!title && !!price && !!url;
};

export const GoodItem = ({id, url, title, logo, price, old_price, shop_id, shop_name,
                           updated_at, created_at, inactive_at, prev_price, subscription_id,
                           price_discount, percent_discount, autobuy_price, min_price}) => {
  
  const invalidGoodProps = {id, url, updated_at, created_at, inactive_at};
  const goodMenuProps = {direction: 'left', good_id: id, subscription_id};
  const isInvalidValid = !isGoodValid({url, title, price});
  const shortGoodItemsProps = {id, url, title, logo, price, old_price, shop_id, shop_name,
    updated_at, created_at, inactive_at, prev_price, subscription_id,
    price_discount, percent_discount, autobuy_price, min_price};
  
  return (
    <div className='goodItemContainer'>
      <GoodMenu {...goodMenuProps}/>
      {!!isInvalidValid &&
          <InvalidGoodItem {...invalidGoodProps} />
      }
      {!isInvalidValid &&
        <ShortGoodItem {...shortGoodItemsProps}/>
      }
    </div>
  
  
  
  )
};

const ShortGoodItem = ({id: good_id, url, title, logo, price, old_price, shop_id, shop_name,
                         updated_at, created_at, inactive_at, prev_price, subscription_id,
                         price_discount, percent_discount, autobuy_price, min_price}) => {
  
  const isInactive = !!inactive_at;
  const diffPrevPrice = !!prev_price && price - prev_price;
  const updatedRange = moment(updated_at).fromNow(true);
  const updatedRangeText = `${updatedRange} назад`;
  const percentDiscount = old_price ? 100 - price / (old_price / 100) : 0;
  const roundedPercentDiscount = Number((percentDiscount).toFixed());
  return (
      <Card className={`goodItem ${isInactive ? 'inactive' : ''}`}>
        <div className='logo'>
          {!!logo ? <Image src={logo} /> : <Icon size='huge' name='image' style={{margin: 30}} /> }
          {percentDiscount > 0 &&
          <Label color='orange' className='discount' size='large' circular>
            -{roundedPercentDiscount}%
          </Label>
          }
        </div>
        <Card.Content>
          <Card.Header as='a' href={url} target='_blank'>{title}</Card.Header>
          {/*<Card.Meta>*/}
          {/*</Card.Meta>*/}
          <Card.Description>
            {!!old_price && <span><strike>{old_price}₽</strike> -> </span>}
            <span>{price} ₽</span>
            &nbsp;
            {!!min_price &&
            <Label color='blue' alt='Минимальная цена'>
              <Icon name='chart bar outline' />{min_price} ₽
            </Label>
            }
            
            {!!diffPrevPrice &&
            <Fragment>
              <Label color={diffPrevPrice > 0 ? 'red' : 'green'}>
                {diffPrevPrice > 0 && '+ '}{diffPrevPrice} ₽
              </Label>
            </Fragment>
            }
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Label floated='right' size='small'><Icon name='shop' />{shop_name}</Label>
          <Label size='small'><Icon name='history' />{updatedRangeText}</Label>
          {!!price_discount &&
          <Label color='orange' size='small'><Icon name='bell outline' />{price_discount} ₽</Label>
          }
          {!!percent_discount &&
          <Label color='orange' size='small'><Icon name='bell outline' />{percent_discount} %</Label>
          }
          {!!autobuy_price &&
          <Label color='blue' size='small'><Icon name='handshake outline' />{autobuy_price} ₽</Label>
          }
        </Card.Content>
      </Card>
  )
};


const InvalidGoodItem = ({good_id, url}) => {
  return (
    
      <Card className='goodItem invalid'>
        <div className='logo'>
          <Icon size='huge' name='ban' style={{margin: 30}}/>
        </div>
        <Card.Content>
          <Card.Header as='a' href={url} target='_blank' style={{
                  overflow: 'hidden',
                  maxWidth: 300,
                  textOverflow: 'ellipsis'
                }}>{url}</Card.Header>
        </Card.Content>
      </Card>
  )
};