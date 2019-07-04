import React, {Fragment} from 'react';
import {Icon, Image, Header, Button, Divider, Label, Item, Dropdown, Modal, TextArea, Checkbox, Radio, Form, Input, Select} from 'semantic-ui-react';
import {removeGood, userGoods} from '../../actionCreators/goods.actionCreators'
import moment from 'moment';
import {connect} from 'react-redux';
import './goodItem.css';

const isGoodInvalid = ({title, price, url}) => {
  const isGoodValid = !!title && !!price && !!url;
  return !isGoodValid;
};

class SubscriptionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'any',
      subscription: {}
    }
  };
  onOpen = async () => {
    const {subscription_id} = this.props;
    const {price_discount, percent_discount} = await fetch(`/subscription?id=${subscription_id}`)
      .then(res => res.json());
    const mode = !!price_discount || !!percent_discount ? 'range' : 'any';
    this.setState({
      mode,
      priceDiscount: price_discount,
      percentDiscount: percent_discount
    });
  };
  handleChange = (e, { name, value }) => this.setState({ [name]: value });
  render() {
    const {subscription_id, trigger} = this.props;
    const {mode, priceDiscount, percentDiscount} = this.state;
    return (
      <Modal dimmer='inverted' size='mini'
             trigger={trigger}
             onOpen={this.onOpen}
             closeIcon>
        <Modal.Header>
          <Icon name='bell outline' />Уведомление о снижении цены</Modal.Header>
        <Modal.Content>
          <p>Отправлять мне сообщение вконтакте:</p>
          <Form>
            <Form.Field
              control={Radio}
              label='При любом снижении цены'
              value='any'
              name='mode'
              checked={mode === 'any'}
              onChange={this.handleChange}
            />
            <Divider horizontal>Или</Divider>
            <Form.Field
              control={Radio}
              label='При снижении цены ниже чем'
              value='range'
              name='mode'
              checked={mode === 'range'}
              onChange={this.handleChange}
            />

            <Form.Group widths='equal'>
              <Form.Field
                disabled={mode !== 'range'}
                fluid
                name="priceDiscount"
                value={priceDiscount}
                icon='ruble sign'
                control={Input}
                onChange={this.handleChange}
              />
              <Form.Field
                disabled={mode !== 'range'}
                value={percentDiscount}
                name='percentDiscount'
                fluid
                icon='percent'
                control={Input}
                onChange={this.handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button positive icon='save outline' labelPosition='right' content='Сохранить'/>
        </Modal.Actions>
      </Modal>
    );
  }
}

class GoodItemTemplate extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {direction, good_id, subscription_id} = this.props;
    return (
        <Dropdown className='menuButton' direction={direction} icon='ellipsis horizontal'>
          <Dropdown.Menu>
            <Dropdown.Menu scrolling>
              <Dropdown.Item icon='trash alternate outline' text='Удалить' onClick={() => this.props.removeGood(good_id)}/>
              <SubscriptionModal subscription_id={subscription_id} trigger={
                <Dropdown.Item icon='bell outline' text='Уведомления'/>
              }/>
            </Dropdown.Menu>
          </Dropdown.Menu>
        </Dropdown>);
  }
}


const GoodMenu = connect(null, dispatch => ({
  removeGood: (good_id) => dispatch(removeGood({id: good_id}))
}))(GoodItemTemplate);

export const GoodItem = ({id: good_id, url, title, logo, price, old_price, shop_id, shop_name,
                           updated_at, created_at, inactive_at, prev_price, subscription_id}) => {
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
        <Item.Header as='a' href={url} target='_blank'>{url}</Item.Header>
      </Item.Content>
    </Item>
  )
};