import React, {Fragment} from 'react';
import {Form, Button} from 'semantic-ui-react';
import {removeGood, userGoods} from "../../actionCreators/goods.actionCreators";
import {connect} from 'react-redux';
import GoodsFilterMenu from "../../component/Menu/GoodsFilterMenu";
import ShopsMenu from "../../component/Menu/ShopsMenu";
import {clearSearch} from "../../actionCreators/goodsSearch.actionCreators";
// import './goodFilterMenu.css';

class GoodsSearchToolbarTemplate extends React.Component {
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
        <Form>
          <Form.Group widths='equal'>
            <ShopsMenu />
            {/*<GoodsFilterMenu />*/}
            {/*<Button onClick={this.props.clearSearch}>Сбросить</Button>*/}
          </Form.Group>
        </Form>);
  }
}


const GoodsSearchToolbar = connect(null, dispatch => ({
  userGoods: ({orderBy}) => dispatch(userGoods({orderBy})),
  // clearSearch: () => dispatch(clearSearch())
}))(GoodsSearchToolbarTemplate);

export default GoodsSearchToolbar;