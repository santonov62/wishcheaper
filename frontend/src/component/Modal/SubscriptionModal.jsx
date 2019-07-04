import React, {Fragment} from 'react';
import {saveSubscriptions, searchSubscriptions} from "../../actionCreators/subscriptions.actionCreators";
import {Icon, Loader, Image, Message, Header, Dimmer, Button, Divider, Label, Item, Dropdown, Modal, TextArea, Checkbox, Radio, Form, Input, Select} from 'semantic-ui-react';
import {connect} from 'react-redux';

class SubscriptionModalTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'any',
      priceDiscount: '',
      percentDiscount: '',
      isLoading: false,
      success: false,
    }
  };
  onOpen = async () => {
    this.setState({isLoading: true, success: false});
    const {subscription_id} = this.props;
    const {price_discount, percent_discount} = await this.props.searchSubscriptions({id: subscription_id});
    
    const mode = !!price_discount || !!percent_discount ? 'range' : 'any';
    this.setState({
      mode,
      priceDiscount: price_discount || '',
      percentDiscount: percent_discount || '',
      isLoading: false
    });
  };
  saveSubscription = async () => {
    const {percentDiscount, priceDiscount, mode} = this.state;
    const {subscription_id} = this.props;
    const isAnyMode = mode === 'any';
    const params = isAnyMode ? {} : {
      price_discount: priceDiscount,
      percent_discount: percentDiscount
    };
    const subscription = await this.props.saveSubscriptions({
      id: subscription_id,
      ...params
    });
    if (!!subscription)
      this.setState({success: true});
  };
  handleChange = (e, { name, value }) => this.setState({ [name]: value });
  render() {
    const {trigger} = this.props;
    const {mode, priceDiscount, percentDiscount, isLoading, success} = this.state;
    return (
        <Modal dimmer='inverted' size='mini'
               trigger={trigger}
               onOpen={() => this.onOpen()}
               closeIcon>
          
          {isLoading &&
          <Loader size='large' active content='Loading'/>
          }
          
          <Modal.Header>
            <Icon name='bell outline' />Уведомления</Modal.Header>
          <Modal.Content>
            
            {!!success &&
            <Message positive>
              <p>
                Сохранено
              </p>
            </Message>
            }
            <p>Уведомлять о измении цены. Будут приходить сообщения вконтакте</p>
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
                  label='Когда цена опустится'
                  value='range'
                  name='mode'
                  checked={mode === 'range'}
                  onChange={this.handleChange}
              />
              
              <Form.Group widths='equal'>
                <Form.Field
                    disabled={mode !== 'range'}
                    fluid
                    label='Ниже суммы'
                    name="priceDiscount"
                    value={priceDiscount}
                    icon='ruble sign'
                    control={Input}
                    onChange={this.handleChange}
                />
                <span style={{marginTop: 30}}>или</span>
                <Form.Field
                    disabled={mode !== 'range'}
                    value={percentDiscount}
                    name='percentDiscount'
                    label='Скидка в процентах'
                    fluid
                    icon='percent'
                    control={Input}
                    onChange={this.handleChange}
                />
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            {/*<Button content='закрыть'/>*/}
            <Button positive icon='save outline' labelPosition='right' content='Сохранить' onClick={this.saveSubscription}/>
          </Modal.Actions>
        </Modal>
    );
  }
}
const SubscriptionModal = connect(null, dispatch => ({
  searchSubscriptions: (params) => dispatch(searchSubscriptions(params)),
  saveSubscriptions: (params) => dispatch(saveSubscriptions(params))
}) )(SubscriptionModalTemplate);

export default SubscriptionModal;