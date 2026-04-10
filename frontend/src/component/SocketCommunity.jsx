import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import * as Actions from "../actions/goods.actions";
import io from 'socket.io-client';

class SocketCommunity extends React.Component {
  state = {
  }
  componentDidMount() {
    let host = window.location.origin.replace(/^http/, 'ws');
    if (!!import.meta.env.VITE_BACKEND_PORT) {
      host = host.replace(`:${import.meta.env.VITE_PORT}`, `:${import.meta.env.VITE_BACKEND_PORT}`);
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
