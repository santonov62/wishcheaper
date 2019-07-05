import React from 'react';
import './shopsPage.css'
import { Button, Header, Icon, Dimmer, Loader, Grid, Image, Item } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'react-redux';
import { allShops } from '../actionCreators/shops.actionCreators';
import ShopItem from "../component/ShopItem/ShopItem";

class ShopsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }
  componentDidMount() {
    this.props.allShops();
  }
  render() {
    const {isLoading} = this.state;
    const {shops = []} = this.props;
    const shopsElements = shops.map((shop, index) => <ShopItem key={index} {...shop}/>);
    return (
      <div className='shopsPage'>
        <Loader size='large' active={isLoading} content='Loading' />
        <Header as='h1'>Магазины</Header>
        <Item.Group divided>
          {!!shopsElements && shopsElements.length > 0
            ? shopsElements :
            <Header as='h2'>Пока пусто</Header>
          }
        </Item.Group>
      </div>
    )
  }
};

export default connect(state => ({
  user: state.user,
  shops: state.shops.value
}), dispatch => ({
  allShops: () => dispatch(allShops())
}))(ShopsPage);
