import React, {Fragment} from 'react';
import {Dropdown} from 'semantic-ui-react';
import {removeGood, userGoods} from "../../actionCreators/goods.actionCreators";
import {connect} from 'react-redux';
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
              icon='sort'
              floating
              labeled
              button
              className='icon'
              options={tagOptions}
              defaultValue={tagOptions[0].value}
              onChange={this.onChange}
          >
            {/*<Dropdown.Menu>*/}
              {/*<Dropdown.Menu scrolling>*/}
                {/*{tagOptions.map((option) => (*/}
                    {/*<Dropdown.Item key={option.value} {...option} />*/}
                {/*))}*/}
              {/*</Dropdown.Menu>*/}
            {/*</Dropdown.Menu>*/}
          </Dropdown>
        </div>);
  }
}


const GoodsFilterMenu = connect(null, dispatch => ({
  userGoods: ({orderBy}) => dispatch(userGoods({orderBy}))
}))(GoodsFilterMenuTemplate);

export default GoodsFilterMenu;