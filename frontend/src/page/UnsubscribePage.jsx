import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { removeSubscription } from "../actionCreators/subscriptions.actionCreators";
import { authWithVk } from "../actionCreators/user.actionCreators";

class UnsubscribePage extends React.Component{

  state = {
    isRemoved: false
  }

  componentDidMount() {
    this.props.authWithVk(() => {
      const url = new URL(window.location.href);
      const id = url.searchParams.get('id');
      this.props.removeSubscription(id).then(() => {
        this.setState({isRemoved: true});
      })
    });
  }

  render() {
    const {isRemoved} = this.state;
    return (
      <div className='unsubscribePage'>
        {isRemoved &&
          <div>
            Подписка удалена
          </div>
        }
        {!isRemoved &&
          <Loader size='large' active={true} content='Loading' />
        }
      </div>
    )
  }
}

const mapState = (state) => ({
  isSignedIn: !!state.user.id,
  vk: state.user.vk
});

export default connect(mapState, dispatch => ({
  removeSubscription: (goodId) => dispatch(removeSubscription({id: goodId})),
  authWithVk: () => dispatch(authWithVk())
}))(UnsubscribePage);
