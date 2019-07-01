import React from 'react';
import {connect} from 'react-redux';
import {Dimmer, Transition, Loader} from 'semantic-ui-react';

class LoadingTracking extends React.Component {
  render() {
    const {isLoading} = this.props;
    return (
        <Loader size='large' active={isLoading} content='Loading' />
    );
  }
}

const mapState = (state) => ({
  isLoading: state.goods.isLoading || state.user.isLoading
});

export default connect(mapState)(LoadingTracking);