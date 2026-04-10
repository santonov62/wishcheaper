import React, { Fragment } from 'react';
import { Dropdown, Icon } from 'semantic-ui-react';
import { userGoods } from "../../actionCreators/goods.actionCreators";
import { connect } from 'react-redux';
import * as Constants from "../../constants";
import { authHeader } from "../../helpers/auth-header";
import { setSearchShopId } from "../../actionCreators/goodsSearch.actionCreators";

class ShopsMenuTemplate extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    options: [],
    value: null
  };

  abortController = new AbortController();

  async componentDidMount() {
    try {
      const shops = await fetch(`shops/myShops`, {
        method: 'GET',
        headers: {
          ...Constants.REQUEST_JSON_HEADERS,
          ...authHeader(this.props.user)
        },
        signal: this.abortController.signal
      }).then(res => res.json());

      const options = shops.map(({ id, title, count }, index) => ({
        key: index,
        text: `${title} (${count})`,
        value: id
      }));
      this.setState({ options });
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  handleChange = (e, { value }) => {
    this.setState({ value });
    this.props.setSearchShopId(value);
    this.props.userGoods();
  };

  render() {
    const { options, value } = this.state;
    const { shopId } = this.props;
    return (
      <Dropdown
        placeholder='Магазин'
        icon='shop'
        floating
        labeled
        button
        className='icon'
        options={options}
        value={value || shopId}
        onChange={this.handleChange}
      />);
  }
}


const ShopsMenu = connect(state => ({
  user: state.user,
  shopId: state.goodsSearch.shopId
}), dispatch => ({
  userGoods: () => dispatch(userGoods()),
  setSearchShopId: (shopId) => dispatch(setSearchShopId(shopId))
}))(ShopsMenuTemplate);

export default ShopsMenu;