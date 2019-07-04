import React, {Fragment} from 'react';
import {Dropdown} from 'semantic-ui-react';
import {removeGood} from "../../actionCreators/goods.actionCreators";
import SubscriptionModal from '../Modal/SubscriptionModal';
import {connect} from 'react-redux';

class GoodItemTemplate extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {direction, good_id, subscription_id} = this.props;
    return (
        <Dropdown className='menuButton' direction={direction} icon='ellipsis horizontal'>
          <Dropdown.Menu>
            <Dropdown.Menu scrolling>
              <Dropdown.Item icon='trash alternate outline' text='Удалить' onClick={() => this.props.removeGood(good_id)}/>
              <SubscriptionModal subscription_id={subscription_id} trigger={
                <Dropdown.Item icon='bell outline' text='Уведомления'/>
              }/>
            </Dropdown.Menu>
          </Dropdown.Menu>
        </Dropdown>);
  }
}


const GoodMenu = connect(null, dispatch => ({
  removeGood: (good_id) => dispatch(removeGood({id: good_id}))
}))(GoodItemTemplate);

export default GoodMenu;