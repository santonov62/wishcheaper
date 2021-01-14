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
                           price_discount, percent_discount, autobuy_price, min_price, removeGood, currency, isRefreshing}) => {
  
  const invalidGoodProps = {id, url, updated_at, created_at, inactive_at};
  // const goodMenuProps = {direction: 'left', good_id: id, subscription_id};
  const isInvalidValid = !isGoodValid({url, title, price});
  const shortGoodItemsProps = {id, url, title, logo, price, old_price, shop_id, shop_name,
    updated_at, created_at, inactive_at, prev_price, subscription_id,
    price_discount, percent_discount, autobuy_price, min_price, currency};
  const isNewGood = created_at === updated_at && !title;

  return (
    <div className='goodItemContainer'>
      {/*<GoodMenu {...goodMenuProps}/>*/}
      <Icon link className='menuButton' title="Удалить" name='trash alternate outline' onClick={() => {
        const isAccepted = window.confirm("Вы действительно хотите удалить товар из отслеживаемых?");
        if (isAccepted)
          removeGood(id);
      }}/>
      {!!isRefreshing &&
      <Dimmer active inverted style={{borderRadius: '15px', backgroundColor: 'transparent', zIndex: 1}}>
          <Loader>Loading</Loader>
          {/*{isRefreshing && <Loader>Loading</Loader>}*/}
          {/*{!isRefreshing && isNewGood && <Icon size='massive' name='clock outline' style={{color: 'grey', opacity: 0.7}}/>}*/}
      </Dimmer>
      }
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
                         price_discount, percent_discount, autobuy_price, min_price, currency}) => {
  currency = currency || '₽';
  const isInactive = !!inactive_at;
  const diffPrevPrice = !!prev_price && price - prev_price;
  const diffPrice = !!old_price && price - old_price;
  const updatedRange = moment(updated_at).fromNow(true);
  const updatedRangeText = `${updatedRange} назад`;
  const percentDiscount = old_price ? 100 - price / (old_price / 100) : 0;
  const roundedPercentDiscount = Number((percentDiscount).toFixed());
  const isImportant = !!roundedPercentDiscount && !!min_price && price < min_price + min_price * 0.015;

  return (
      <Card className={`goodItem ${isInactive ? 'inactive' : ''}`}>
        <div className='logo'>
          {!!logo ? <Image src={logo} /> : <Icon size='huge' name='image' style={{margin: 30}} /> }
          <div className='floating'>
            {percentDiscount > 0 &&
            <Label title="Скидка в процентах" color='black' size='large' circular>
              {roundedPercentDiscount}%
            </Label>
            }
            {/*{isImportant &&*/}
            {/*<Label title="Выгодный вариант" color='red' size='large' circular>*/}
              {/*<Icon name='fire'/>*/}
            {/*</Label>*/}
            {/*}*/}
          </div>
        </div>

        <Card.Content>
          <div style={{color: '#91998c', fontSize: '13px', marginBottom: '3px'}}><Icon name='shop' />{shop_name}</div>
          <Card.Header className='title' as='a' href={url} target='_blank' title={title}>
            {/*{isImportant &&*/}
              {/*<Icon title="Выгодная цена" color="red" name='fire'/>*/}
            {/*}*/}
            {title}
          </Card.Header>
          {/*<Card.Meta>*/}
            {/*<Icon name='shop' /> {shop_name}*/}
          {/*</Card.Meta>*/}
          <Card.Description>
            {!!price &&
                <div style={{marginBottom: 10, marginTop: 10}}>
                  <div>
                    {!!old_price && old_price !== price &&
                      <div>
                        &nbsp;<span style={{fontSize: 16, color: '#91998c'}} title="Старая цена"><strike>{old_price}{currency}</strike></span>
                        {!!diffPrice &&
                          <Fragment>
                            &nbsp;&nbsp;<span style={{fontSize: 11, color: diffPrice < 0 ? 'green' : 'red'}} title="Скидка">{diffPrice} {currency}</span>
                          </Fragment>
                        }
                      </div>
                    }
                    <div style={{fontSize: 30, lineHeight: 1, color: '#000', marginBottom: 10, whiteSpace: 'nowrap'}} title="Цена">
                      {price} {currency}
                      {!!diffPrevPrice &&
                        <span style={{fontSize: '14px', color: diffPrevPrice > 0 ? 'red' : 'green'}}
                              title="Изменения в цене">
                          &nbsp;<Icon name={diffPrevPrice > 0 ? 'caret up' : 'caret down'} style={{margin: 0}}/>{Math.abs(diffPrevPrice)} {currency}
                        </span>
                      }
                    </div>
                  </div>

                  <div>
                    {!!isImportant &&
                    <Label color="green" size='small' title="Сейчас самая низкая цена">
                      <Icon name='thumbs up' />Выгодно
                    </Label>
                    }

                    {!!min_price && min_price < price &&
                    <Label size='small' title="Самая низкая цена">
                      <Icon name='area chart' />{min_price} {currency}
                    </Label>
                    }
  
                    {/*{!!diffPrevPrice &&*/}
                    {/*<Label size='small' color={diffPrevPrice > 0 ? 'red' : 'green'} title="Повышение/понижение цены относительно предыдущего обновления">*/}
                      {/*<Icon name={diffPrevPrice > 0 ? 'caret up' : 'caret down'} />{Math.abs(diffPrevPrice)} {currency}*/}
                    {/*</Label>*/}
                    {/*}*/}

                    {/*{!!diffPrevPrice &&*/}
                    {/*<span style={{color: diffPrevPrice > 0 ? 'red' : 'green'}} title="Изменения в цене">*/}
                      {/*<Icon name={diffPrevPrice > 0 ? 'caret up' : 'caret down'} />{Math.abs(diffPrevPrice)} {currency}*/}
                    {/*</span>*/}
                    {/*}*/}
                  </div>

                </div>
            }
            {!price &&
                <div>
                  Нет цены
                </div>
            }
            
          </Card.Description>
        </Card.Content>
        
        <Card.Content extra>
          {/*<Label color='blue' size='small' title="Магазин"><Icon name='shop' />{shop_name}</Label>*/}
          <Label size='small' title="Последнее обновление"><Icon name='history' />{updatedRangeText}</Label>

          {!!autobuy_price &&
          <Label color='blue' size='small'><Icon name='handshake outline' />{autobuy_price} {currency}</Label>
          }
  
          {/*{!!min_price &&*/}
          {/*<Label size='small' color="red" title="Лучшая цена">*/}
            {/*<Icon name='fire' />{min_price} {currency}*/}
          {/*</Label>*/}
          {/*}*/}

          {/*{!!diffPrevPrice &&*/}
          {/*<Label size='small' color={diffPrevPrice > 0 ? 'red' : 'green'} title="Динамика цены/изменение от предыдущего сканирования">*/}
            {/*<Icon name={diffPrevPrice > 0 ? 'caret up' : 'caret down'} />{Math.abs(diffPrevPrice)} {currency}*/}
          {/*</Label>*/}
          {/*}*/}
          <SubscriptionModal subscription_id={subscription_id} trigger={
            <Label as='a' color='orange' size='small' title="Оповещение о снижении цены">
              <Icon name='bell' />
              {!percent_discount && !price_discount && 'Всегда'}
              {!!percent_discount && <Fragment>{percent_discount} %</Fragment>}
              {!!price_discount && <Fragment>{price_discount} {currency}</Fragment>}
            </Label>
          }/>

        </Card.Content>
        
      </Card>
  )
};


const InvalidGoodItem = ({good_id, url}) => {
  return (
    
      <Card className='goodItem invalid'>
        <div className='o'>
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