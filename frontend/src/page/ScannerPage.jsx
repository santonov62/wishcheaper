import React from 'react';
import './scannerPage.css'
import { Button, Header, Icon, Dimmer, Loader } from 'semantic-ui-react';
import moment from 'moment';
import {authHeader} from "../helpers/auth-header";
import { connect } from 'react-redux';

class ScannerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      time: null,
      isLoading: false
    }
  }
  componentDidMount() {
    this.status();
  }
  status = () => {
    this.setState({isLoading: true});
    fetch(`checker/status`, {
        method: 'GET',
        headers: {
          ...authHeader(this.props.user)
        }
      })
      .then(res => res.json())
      .then(({isActive, time}) => {
        this.setState({isActive, time, isLoading: false});
      })
  };
  start = () => {
    fetch(`checker/start`, {
        method: 'GET',
        headers: {
          ...authHeader(this.props.user)
        }
      })
      .then(res => res.json())
      .then(({isActive, time}) => {
        this.setState({isActive, time});
      })
  };
  stop = () => {
    fetch(`checker/stop`, {
        method: 'GET',
        headers: {
          ...authHeader(this.props.user)
        }
      })
      .then(res => res.json())
      .then(({isActive, time}) => {
        this.setState({isActive, time});
      })
  };
  render() {
    const {time, isActive, isLoading} = this.state;
    const addedRange = moment(time).fromNow(true);
    const addedRangeText = `${addedRange} назад`;
    return (
      <div className='scannerPage'>
        <Loader size='large' active={isLoading} content='Loading' />
        <Header as='h2'>
          <Icon name='settings' />
          <Header.Content>
            {isActive ? `Сканер запущен` : `Сканер остановлен`}
            <Header.Subheader>{addedRangeText}</Header.Subheader>
          </Header.Content>
        </Header>
        {isActive ?
          <Button secondary onClick={this.stop}>Остановить</Button>
          :
          <Button primary onClick={this.start}>Запустить</Button>
        }
      </div>
    )
  }
};

export default connect(state => ({
  user: state.user
}))(ScannerPage);
