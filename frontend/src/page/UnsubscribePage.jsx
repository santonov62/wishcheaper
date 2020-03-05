import React from 'react';
import { connect } from 'react-redux';
import { removeGood } from "../actionCreators/goods.actionCreators";
import { authWithVk } from "../actionCreators/user.actionCreators";
import {Loader, Button, Segment, Container, Header} from 'semantic-ui-react';
import './unsubscribePage.css';

class UnsubscribePage extends React.Component{

  state = {
    isRemoved: false,
    isLoading: false
  };

  async componentDidMount() {
    this.remove();
  }
  remove = async() => {
    try {
      this.setState({isLoading: true});
      const url = new URL(window.location.href);
      const id = url.searchParams.get('id');
      const subscription = await this.props.removeGood(id);
      if (!!subscription)
          this.setState({isRemoved: true});
      return Promise.resolve(true)
    } finally {
      this.setState({isLoading: false});
    }
    return Promise.reject();
  };
  render() {
    const {isRemoved, isLoading} = this.state;
    return (
      <div className='unsubscribePage'>
        {/*<Header as='h1'>Отписаться</Header>*/}
        {isRemoved &&
          <div>
            Подписка удалена
          </div>
        }
        {!!isLoading &&
          <Loader size='large' active={true} content='Loading' />
        }
        {!isRemoved &&
            <div>
              <Button onClick={() => this.remove()} size='big'>Отписаться</Button>
            </div>
        }
      </div>
    )
  }
}

const mapState = (state) => ({
  isSignedIn: !!state.user.id,
  vk: state.user.vk,
  user: state.user
});

export default connect(mapState, dispatch => ({
  removeGood: (goodId) => dispatch(removeGood({id: goodId})),
  authWithVk: () => dispatch(authWithVk())
}))(UnsubscribePage);
