import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import * as Actions from "../actions/goods.actions";
import io from 'socket.io-client';

class SocketCommunity extends React.Component {
  state = {
  }
  componentDidMount() {
    let host = window.location.origin.replace(/^http/, 'ws');
    if (!!process.env.REACT_APP_BACKEND_PORT) {
      host = host.replace(`:${process.env.PORT}`, `:${process.env.REACT_APP_BACKEND_PORT}`);
    }
    const ws = io(host);
    ws.on('good', good => {
      console.log('[SocketCommunity] -> good: ', good);

      this.props.dispatch({
        type: Actions.GOODS_SAVED,
        payload: {goods: good}
      });

    });
  }
  render() {
    return (
        <Fragment>
          
        </Fragment>
    );
  }
}

export default connect()(SocketCommunity);
