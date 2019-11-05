import React, {Fragment} from 'react';
import {Dropdown, Icon} from 'semantic-ui-react';
import {removeGood} from "../../actionCreators/goods.actionCreators";
import {connect} from 'react-redux';
import * as Constants from "../../constants";
import {authHeader} from "../../helpers/auth-header";

class ShopsMenuTemplate extends React.Component {
  constructor(props) {
    super(props);
  }
  
  state = {
    options: [],
    value: null
  };
  
  async componentDidMount() {
    const shops = await fetch(`shops/myShops`, {
      method: 'GET',
      headers: {
        ...Constants.REQUEST_JSON_HEADERS,
        ...authHeader(this.props.user)
      }
    }).then(res => res.json());
    const options = shops.map(({id, title, count}, index) => ({
      key: index,
      text: `${title} (${count})`,
      value: id
    }));
    this.setState({options});
  }
  
  handleChange = (e, { value }) => {
    this.setState({ value });
  }
  
  render() {
    const {options, value} = this.state;
    return (
          <Dropdown
              placeholder='Магазин'
              icon='shop'
              floating
              labeled
              button
              className='icon'
              options={options}
              value={value}
              onChange={this.handleChange}
          />);
  }
}


const ShopsMenu = connect(state => ({
  user: state.user
}), dispatch => ({
  removeGood: (good_id) => dispatch(removeGood({id: good_id}))
}))(ShopsMenuTemplate);

export default ShopsMenu;