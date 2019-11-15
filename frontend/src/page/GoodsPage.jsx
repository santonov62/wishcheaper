import React, {Fragment} from 'react';
import './goodsPage.css'
import { Button, Header, Icon, Dimmer, Loader, Container, Segment, Divider, Grid, Image, Item, Dropdown, Input, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {authHeader} from "../helpers/auth-header";
import { connect } from 'react-redux';
import { userGoods, searchGoods } from '../actionCreators/goods.actionCreators';
import {GoodItem} from "../component/GoodItem/GoodItem";
import GoodsSearchToolbar from "../component/Goods/GoodsSearchToolbar";

class GoodsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }
  componentDidMount() {
    const url = new URL(window.location.href);
    const id = url.searchParams.get('id');
    if (!!id) {
      this.props.searchGoods({id}).finally(() => this.setState({isLoading: false}));
    } else {
      this.props.userGoods({
        id: url.searchParams.get('id')
      }).finally(() => this.setState({isLoading: false}));
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
          {goodsElements.length > 0 &&
              <Fragment>
                <GoodsSearchToolbar />
                <div className='goods'>
                  {goodsElements}
                </div>
              </Fragment>
          }
  
          {!isLoading && goodsElements.length === 0 &&
          <Segment style={{ padding: '4em 0em' }} vertical>
            <Container text>
              <Header as='h3' style={{ fontSize: '2em' }}>
                Что бы добавить товар в отслеживаемые
              </Header>
              {/*<p style={{ fontSize: '1.33em' }}>*/}
                <ul>
                  <li>Откройте вкладку с товаром и скопируйте ссылку на товар</li>
                  <li>Вставьте ссылку на товар в поле добавления и нажмите "+"</li>
                </ul>
              {/*</p>*/}
              <Divider
                  as='h4'
                  className='header'
                  horizontal
                  style={{ margin: '3em 0em', textTransform: 'uppercase' }}
              >
                Или
              </Divider>
              <Header as='h3' style={{ fontSize: '2em' }}>
                Что бы доавить товар в отслеживаемые через расширение браузера Chrome
              </Header>
              {/*<p style={{ fontSize: '1.33em' }}>*/}
                <ul>
                  <li>Установите расширение для браузера Chrome</li>
                  <li>Откройте вкладку с товаром</li>
                  <li>Нажмите на иконку расширения и авторизиркйтес если понадобится</li>
                  <li>Товар будет автоматически добавлен</li>
                </ul>
              <Button>Расширение Chrome</Button>
              {/*</p>*/}
            </Container>
          </Segment>
          }
          
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
