import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {apiError, apiInit} from "../actionCreators/vk.actionCreators";
import Script from 'react-load-script';

class AppLoader extends React.Component {

  render() {
    const { dataLoaded, children, vkApiInit, vkApiError } = this.props;
    
    return dataLoaded ?
      <Fragment>
        {children}
        {!window.VK && <Script
            url="//vk.com/js/api/openapi.js"
            onLoad={vkApiInit}
            onError={vkApiError}
        />}
      </Fragment>
        : 'Init app...';
  }
}

const mapState = (state) => ({
  dataLoaded: true
});

const mapDispatch = (dispatch) => ({
  vkApiInit: () => dispatch(apiInit()),
  vkApiError: () => dispatch(apiError())
});

export default connect(mapState, mapDispatch)(AppLoader);
