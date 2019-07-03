import React, {Fragment} from 'react';
import {Icon, Image, Header, Button, Label, Item, Dropdown} from 'semantic-ui-react';
import {removeGood, userGoods} from '../../actionCreators/goods.actionCreators'
import moment from 'moment';
import {connect} from 'react-redux';
import './goodItem.css';

const isGoodInvalid = ({title, price, url}) => {
  const isGoodValid = !!title && !!price && !!url;
  return !isGoodValid;
};

class GoodItemTemplate extends React.Component {
  constructor(props) {
    super(props);
  }
  configureNotifications = () => {
  
  };
  render() {
    const {direction, good_id, subscription_id} = this.props;
    return (
        <Dropdown className='menuButton' direction={direction} icon='ellipsis horizontal'>
          <Dropdown.Menu>
            <Dropdown.Menu scrolling>
              <Dropdown.Item icon='trash alternate outline' text='Удалить' onClick={() => this.props.removeGood(good_id)}/>
              <Dropdown.Item icon='bell outline' text='Настроить уведомление' onClick={() => this.props.configureNotifications(subscription_id)}/>
            </Dropdown.Menu>
          </Dropdown.Menu>
        </Dropdown>);
  }
}


const GoodMenu = connect(null, dispatch => ({
  removeGood: (good_id) => dispatch(removeGood({id: good_id}))
}))(GoodItemTemplate);

export const GoodItem = ({id: good_id, url, title, logo, price, old_price, shop_id, shop_name,
                           updated_at, created_at, inactive_at, prev_price}) => {
  const invalidGoodProps = {good_id, url, updated_at, created_at, inactive_at};
  const goodMenuProps = {direction: 'left', good_id};
  
  const isValid = isGoodInvalid({url, title, price});
  if (isValid) {
    return <InvalidGoodItem {...invalidGoodProps} {...goodMenuProps}/>;
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
              {/*{percentDiscount > 0 &&*/}
              {/*<Label>*/}
                {/*- {roundedPercentDiscount} %*/}
              {/*</Label>*/}
              {/*}*/}
              <Label color={diffPrevPrice > 0 ? 'red' : 'green'}>
                {diffPrevPrice > 0 && '+ '}{diffPrevPrice} ₽
              </Label>
            </Fragment>
            }
            
          </Item.Meta>
          <Item.Extra>
            <Label floated='right' size='small'><Icon name='shop' />{shop_name}</Label>
            <Label size='small' style={{float: 'right'}}><Icon name='history' />{updatedRangeText}</Label>
          </Item.Extra>
        </Item.Content>
      </Item>
  )
};

const InvalidGoodItem = ({good_id, url, direction}) => {
  const goodMenuProps = {good_id, direction}
  return (
    <Item className='goodItem invalid'>
      <Item.Image className='logo' size='tiny'>
        <Icon size='huge' name='ban' />
      </Item.Image>

      <Item.Content>
        <GoodMenu {...goodMenuProps}/>
        <Item.Header as='a' href={url} target='_blank'>{url}</Item.Header>
      </Item.Content>
    </Item>
  )
};