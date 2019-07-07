import React from 'react';
import './goodsPage.css'
import { Button, Header, Icon, Dimmer, Loader, Grid, Image, Item } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {authHeader} from "../helpers/auth-header";
import { connect } from 'react-redux';
import { userGoods } from '../actionCreators/goods.actionCreators';
import {GoodItem} from "../component/GoodItem/GoodItem";

class GoodsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }
  componentDidMount() {
    this.props.userGoods();
  }
  render() {
    const {isLoading} = this.state;
    const {goods = []} = this.props;
    const goodsElements = goods.map((good, index) => <GoodItem key={index} {...good}/>);
    return (
      <div className='goodsPage'>
        <Loader size='large' active={isLoading} content='Loading' />
        <Header as='h1'>Мои товары</Header>
        <Item.Group divided>
          {!!goodsElements && goodsElements.length > 0
            ? goodsElements :
            <Header as='h2'>Пока пусто</Header>
          }
        </Item.Group>
      </div>
    )
  }
};

export default connect(state => ({
  user: state.user,
  goods: state.goods.value
}), dispatch => ({
  userGoods: () => dispatch(userGoods())
}))(GoodsPage);
