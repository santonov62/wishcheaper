import React from 'react';
import {connect} from 'react-redux';
import {Dimmer, Transition, Loader} from 'semantic-ui-react';

class LoadingTracking extends React.Component {
  render() {
    const {isDataLoading} = this.props;
    return (
        <Loader size='large' active={isDataLoading} content='Loading' />
    );
  }
}

const mapState = (state) => ({
  isDataLoading: state.goods.isLoading || state.user.isLoading
});

export default connect(mapState)(LoadingTracking);