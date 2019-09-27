import React, {Fragment} from 'react';
import {Icon, Loader, Image, Message, Header, Dimmer, Button, Divider, Label, Item, Dropdown, Modal, TextArea, Checkbox, Radio, Form, Input, Select} from 'semantic-ui-react';
import {removeGood, userGoods} from '../../actionCreators/goods.actionCreators'
import moment from 'moment';
import {allShops} from '../../actionCreators/shops.actionCreators';
import {connect} from 'react-redux';
// import './shopToolbar.css';

class ShopsToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    
    }
  }
  componentDidMount() {
  
  }
  
  render() {
    const {id, name, url, title, logo, updated_at, created_at} = this.props;
    const {scanInterval} = this.state;
    return (
        <Label.Group>
          <Label as='a'>Smart</Label>
        </Label.Group>
    )}
};

// export default connect(null, dispatch => ({
//   allShops: (params) => dispatch(allShops(params))
// }))(ShopsToolbar);
export default ShopsToolbar;