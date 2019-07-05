import React, {Fragment} from 'react';
import {Icon, Loader, Image, Message, Header, Dimmer, Button, Divider, Label, Item, Dropdown, Modal, TextArea, Checkbox, Radio, Form, Input, Select} from 'semantic-ui-react';
import {removeGood, userGoods} from '../../actionCreators/goods.actionCreators'
import moment from 'moment';
import {updateShop} from '../../actionCreators/shops.actionCreators';
import {connect} from 'react-redux';
import './shopItem.css';

class ShopItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scanInterval: props.scan_interval
    }
  }
  save = () => {
    const {id} = this.props;
    const {scanInterval} = this.state;
    this.props.updateShop({id, scanInterval});
  };
  handleChange = (e, { name, value }) => this.setState({ [name]: value });
  render() {
    const {id, name, url, title, logo, updated_at, created_at} = this.props;
    const {scanInterval} = this.state;
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
            <Input labelPosition='left'
                   label='Сканировать каждые (мин.)'
                   action={<Button color='teal' icon='save' onClick={this.save}/>}
                   placeholder='15...'
                   value={scanInterval}
                   name='scanInterval'
                   onChange={this.handleChange}/>
          </Item.Meta>
          <Item.Extra>
            {/*<Label>*/}
              {/*{name}*/}
            {/*</Label>*/}

          </Item.Extra>
        </Item.Content>
      </Item>
    )}
};

export default connect(null, dispatch => ({
  updateShop: (params) => dispatch(updateShop(params))
}))(ShopItem);