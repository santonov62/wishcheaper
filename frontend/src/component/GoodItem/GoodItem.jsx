import React, {Fragment} from 'react';
import {Icon, Loader, Image, Message, Header, Dimmer, Card, Button, Divider, Label, Item, Dropdown, Modal, TextArea, Checkbox, Radio, Form, Input, Select} from 'semantic-ui-react';
import {removeGood, userGoods} from '../../actionCreators/goods.actionCreators'
import moment from 'moment';
import {connect} from 'react-redux';
import './goodItem.css';
// import GoodMenu from './GoodMenu';
import SubscriptionModal from '../Modal/SubscriptionModal';

const isGoodValid = ({title, price, url}) => {
  return !!title && !!url;
};

const GoodItemTmpl = ({id, url, title, logo, price, old_price, shop_id, shop_name,
                           updated_at, created_at, inactive_at, prev_price, subscription_id,
                           price_discount, percent_discount, autobuy_price, min_price, removeGood}) => {
  
  const invalidGoodProps = {id, url, updated_at, created_at, inactive_at};
  // const goodMenuProps = {direction: 'left', good_id: id, subscription_id};
  const isInvalidValid = !isGoodValid({url, title, price});
  const shortGoodItemsProps = {id, url, title, logo, price, old_price, shop_id, shop_name,
    updated_at, created_at, inactive_at, prev_price, subscription_id,
    price_discount, percent_discount, autobuy_price, min_price};
  
  return (
    <div className='goodItemContainer'>
      {/*<GoodMenu {...goodMenuProps}/>*/}
      <Icon link className='menuButton' title="Удалить" name='close' onClick={() => {
        const isAccepted = window.confirm("Вы действительно хотите удалить товар из подписок?");
        if (isAccepted)
          removeGood(id);
      }}/>
      {isInvalidValid &&
          <InvalidGoodItem {...invalidGoodProps} />
      }
      {!isInvalidValid &&
        <ShortGoodItem {...shortGoodItemsProps}/>
      }
    </div>
  
  
  
  )
};

export const GoodItem = connect(null, dispatch => ({
  removeGood: (good_id) => dispatch(removeGood({id: good_id}))
}))(GoodItemTmpl);

const ShortGoodItem = ({id: good_id, url, title, logo, price, old_price, shop_id, shop_name,
                         updated_at, created_at, inactive_at, prev_price, subscription_id,
                         price_discount, percent_discount, autobuy_price, min_price}) => {
  
  const isInactive = !!inactive_at;
  const diffPrevPrice = !!prev_price && price - prev_price;
  const diffPrice = !!old_price && price - old_price;
  const updatedRange = moment(updated_at).fromNow(true);
  const updatedRangeText = `${updatedRange} назад`;
  const percentDiscount = old_price ? 100 - price / (old_price / 100) : 0;
  const roundedPercentDiscount = Number((percentDiscount).toFixed());
  const isImportant = !!roundedPercentDiscount && !!min_price && price < min_price + min_price * 0.015;
  return (
      <Card className={`goodItem ${isInactive ? 'inactive' : ''} ${isImportant ? 'important' : ''}`}>
        <div className='logo'>
          {!!logo ? <Image src={logo} /> : <Icon size='huge' name='image' style={{margin: 30}} /> }
          <div className='floating'>
            {percentDiscount > 0 &&
            <Label title="Скидка в процентах" color='yellow' size='large' circular>
              {roundedPercentDiscount}%
            </Label>
            }
            {isImportant &&
            <Label title="Выгодный вариант" color='red' size='large' circular>
              <Icon name='fire'/>
            </Label>
            }
          </div>
        </div>
        <Card.Content>
          <Card.Header className='title' as='a' href={url} target='_blank'>{title}</Card.Header>
          {/*<Card.Meta>*/}
          {/*</Card.Meta>*/}
          <Card.Description>
            {!!price &&
                <div style={{marginBottom: 10, marginTop: 10}}>
                  {!!old_price &&
                    <Fragment>
                      &nbsp;<span style={{fontSize: 16, color: '#ccc'}} title="Старая цена"><strike>{old_price}₽</strike></span>
                      {!!diffPrice &&
                        <Fragment>&nbsp;&nbsp;<span style={{fontSize: 11, color: 'green'}} title="Скидка">{diffPrice} ₽</span></Fragment>
                      }
                      <br />
                    </Fragment>
                  }
                  <span style={{fontSize: 28, lineHeight: 1}} title="Цена">{price} ₽</span>
                  <br />
                </div>
            }
            {!price &&
                <Fragment>
                  Нет цены
                  <br />
                </Fragment>
            }
            
          </Card.Description>
        </Card.Content>
        
        <Card.Content extra>
          <Label color='blue' size='small' title="Магазин"><Icon name='shop' />{shop_name}</Label>
          <Label color="grey" size='small' title="Последнее обновление"><Icon name='history' />{updatedRangeText}</Label>

          {!!autobuy_price &&
          <Label color='blue' size='small'><Icon name='handshake outline' />{autobuy_price} ₽</Label>
          }
  
          {!!min_price &&
          <Label color="red" title="Лучшая цена">
            <Icon name='fire' />{min_price} ₽
          </Label>
          }

          {!!diffPrevPrice &&
          <Label color={diffPrevPrice > 0 ? 'red' : 'green'} title="Динамика цены/изменение от предыдущего сканирования">
            <Icon name={diffPrevPrice > 0 ? 'caret up' : 'caret down'} />{Math.abs(diffPrevPrice)} ₽
          </Label>
          }
          <SubscriptionModal subscription_id={subscription_id} trigger={
            <Label as='a' color='orange' size='small' title="Оповещение о снижении цены">
              <Icon name='bell' />
              {!!percent_discount && <Fragment>{percent_discount} %</Fragment>}
              {!percent_discount && 'Всегда'}
            </Label>
          }/>

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