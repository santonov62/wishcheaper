import React, {Fragment} from 'react';
import {Dropdown} from 'semantic-ui-react';
import {removeGood} from "../../actionCreators/goods.actionCreators";
import {connect} from 'react-redux';
import './goodMenu.css';

const tagOptions = [
  {
    key: 'Important',
    text: 'Important',
    value: 'Important',
    label: { color: 'red', empty: true, circular: true },
  },
  {
    key: 'Announcement',
    text: 'Announcement',
    value: 'Announcement',
    label: { color: 'blue', empty: true, circular: true },
  },
  {
    key: 'Cannot Fix',
    text: 'Cannot Fix',
    value: 'Cannot Fix',
    label: { color: 'black', empty: true, circular: true },
  },
  {
    key: 'News',
    text: 'News',
    value: 'News',
    label: { color: 'purple', empty: true, circular: true },
  },
  {
    key: 'Enhancement',
    text: 'Enhancement',
    value: 'Enhancement',
    label: { color: 'orange', empty: true, circular: true },
  },
  {
    key: 'Change Declined',
    text: 'Change Declined',
    value: 'Change Declined',
    label: { empty: true, circular: true },
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
              text='Фильтровать'
              icon='filter'
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