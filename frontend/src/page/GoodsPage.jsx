import React from 'react';
import './scannerPage.css'
import { Button, Header, Icon, Dimmer, Loader, Grid, Image, Item } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {authHeader} from "../helpers/auth-header";
import { connect } from 'react-redux';
import { userGoods } from '../actionCreators/goods.actionCreators';

class GoodsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
    }
    componentDidMount() {
        const {user} = this.props;
        this.props.userGoods({ vk: user.vk });
    }
    render() {
        const {isLoading} = this.state;
        const {goods = []} = this.props;
        const goodsElements = goods.map(({logo, id, title, url, price, old_price}, index) => <Item key={index}>
            <Item.Image size='tiny' src={logo} />
    
            <Item.Content>
                <Item.Header as='a' href={url} target='_blank'>{title}</Item.Header>
    
                <Item.Meta>
                    {price} ₽
                    <strike>{old_price} {!!old_price && '₽'}</strike>
                </Item.Meta>
            </Item.Content>
        </Item>);
        return (
            <div className='scannerPage'>
                <Loader size='large' active={isLoading} content='Loading' />
                <Header as='h1'>Мои товары</Header>
                <Item.Group>
                    {goodsElements}
                </Item.Group>
            </div>
        )
    }
};

export default connect(state => ({
    user: state.user,
    goods: state.goods.value
}), dispatch => ({
    userGoods: (params) => dispatch(userGoods(params))
}))(GoodsPage);
