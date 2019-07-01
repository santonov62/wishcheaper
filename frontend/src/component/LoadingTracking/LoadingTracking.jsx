import React from 'react';
import {connect} from 'react-redux';
import {Dimmer, Transition} from 'semantic-ui-react';
import CubeSpinner from '../CubeSpinner/CubeSpinner';

class LoadingTracking extends React.Component {
  render() {
    const {isDataLoading} = this.props;
    return (
        <Transition visible={isDataLoading} animation='scale' duration={200} style={{zIndex: -1}}>
            <Dimmer active={isDataLoading} style={{background: 'transparent'}}>
              <CubeSpinner/>
            </Dimmer>
        </Transition>
    );
  }
}

const mapState = (state) => ({
  isDataLoading: state.goods.isLoading || state.shops.isLoading || state.currency.isLoading || state.user.isLoading
});

export default connect(mapState)(LoadingTracking);