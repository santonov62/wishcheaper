import React from 'react';
import './goodsPage.css'
import { Button, Header, Icon, Dimmer, Loader, Grid, Image, Item, Dropdown, Input, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {authHeader} from "../helpers/auth-header";
import { connect } from 'react-redux';
import { userGoods, searchGoods } from '../actionCreators/goods.actionCreators';
import {GoodItem} from "../component/GoodItem/GoodItem";
import GoodsFilterMenu from "../component/Menu/GoodsFilterMenu";
import ShopsMenu from "../component/Menu/ShopsMenu";

class GoodsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }
  componentDidMount() {
    const url = new URL(window.location.href);
    const id = url.searchParams.get('id');
    if (!!id) {
      this.props.searchGoods({id});
    } else {
      this.props.userGoods({
        id: url.searchParams.get('id')
      });
    }

  }
  render() {
    const {isLoading} = this.state;
    const {goods = []} = this.props;
    const goodsElements = goods.map((good, index) => <GoodItem key={index} {...good}/>);
    return (
        <div className='goodsPage'>
          <Loader size='large' active={isLoading} content='Loading'/>
          <Header as='h1'>Мои товары</Header>
          <Form>
            <Form.Group widths='equal'>
              <ShopsMenu />
              <GoodsFilterMenu />
            </Form.Group>
          </Form>
          <div className='goods'>
            {goodsElements}
          </div>
        </div>
    )
  }
};

export default connect(state => ({
  user: state.user,
  goods: state.goods.value
}), dispatch => ({
  userGoods: () => dispatch(userGoods()),
  searchGoods: ({id}) => dispatch(searchGoods({id}))
}))(GoodsPage);
