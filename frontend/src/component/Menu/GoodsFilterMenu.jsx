import React, {Fragment} from 'react';
import {Dropdown} from 'semantic-ui-react';
import {removeGood} from "../../actionCreators/goods.actionCreators";
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
  render() {
    const {direction, good_id, subscription_id} = this.props;
    return (
        <div className="filterPanel">
          <Dropdown
              text='Сортировать'
              icon='sort'
              floating
              labeled
              button
              className='icon'
          >
            <Dropdown.Menu>
              {/*<Input icon='search' iconPosition='left' className='search' />*/}
              {/*<Dropdown.Divider />*/}
              {/*<Dropdown.Header icon='tags' content='Tag Label' />*/}
              <Dropdown.Menu scrolling>
                {tagOptions.map((option) => (
                    <Dropdown.Item key={option.value} {...option} />
                ))}
              </Dropdown.Menu>
            </Dropdown.Menu>
          </Dropdown>
        </div>);
  }
}


const GoodsFilterMenu = connect(null, dispatch => ({
  removeGood: (good_id) => dispatch(removeGood({id: good_id}))
}))(GoodsFilterMenuTemplate);

export default GoodsFilterMenu;