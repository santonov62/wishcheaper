import React, {Fragment} from 'react';
import {Dropdown} from 'semantic-ui-react';
import {removeGood, userGoods} from "../../actionCreators/goods.actionCreators";
import {connect} from 'react-redux';
import {clearSearch} from "../../actionCreators/goodsSearch.actionCreators";
// import './goodFilterMenu.css';

const tagOptions = [
  {
    key: 'createdAt',
    text: 'Дате добавления',
    value: 'createdAt',
    icon: 'time'
  },
  {
    key: 'price',
    text: 'Цене',
    value: 'price',
    icon: 'money bill alternate outline'
  },
  {
    key: 'discount',
    text: 'Скидке',
    value: 'discount',
    icon: 'percent'
  }
];

class GoodsFilterMenuTemplate extends React.Component {
  constructor(props) {
    super(props);
  }
  onChange = (event, {value}) => {
    this.props.userGoods({
      orderBy: value
    });
  };
  render() {
    const {direction, good_id, subscription_id} = this.props;
    return (
        <div className="filterPanel">
          <Dropdown
              placeholder='Сортировать'
              icon='sort'
              floating
              labeled
              button
              className='icon'
              options={tagOptions}
              onChange={this.onChange}
          >
          </Dropdown>
        </div>);
  }
}


const GoodsFilterMenu = connect(null, dispatch => ({
  userGoods: ({orderBy}) => dispatch(userGoods({orderBy}))
}))(GoodsFilterMenuTemplate);

export default GoodsFilterMenu;