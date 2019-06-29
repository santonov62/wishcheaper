import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import {authWithVk} from "../actionCreators/user.actionCreators";
import {connect} from 'react-redux';

class VkButton extends React.Component {

  render() {
    const {text, size} = this.props;
    return (
      <Button size={size} icon color='vk' onClick={this.props.authWithVk}>
        <Icon name='vk'/> {text}
      </Button>
    )
  }
}

export default connect(null, dispatch => ({
  authWithVk: () => {
    dispatch(authWithVk());
  }
}))(VkButton);