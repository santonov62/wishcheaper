import React from 'react';
import './scannerPage.css'
import { Button, Header, Icon, Dimmer, Loader, Grid, Image } from 'semantic-ui-react';
import moment from 'moment';
import {authHeader} from "../helpers/auth-header";
import { connect } from 'react-redux';

class ScannerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStarted: false,
      time: null,
      lastParseTime: null,
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
      .then(({isStarted, time, lastParseTime}) => {
        this.setState({isStarted, time, lastParseTime, isLoading: false});
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
      .then(({isStarted, time}) => {
        this.setState({isStarted, time});
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
      .then(({isStarted, time, lastParseTime}) => {
        this.setState({isStarted, time, lastParseTime});
      })
  };
  scan = () => {
    fetch(`checker/scan`, {
        method: 'GET',
        headers: {
          ...authHeader(this.props.user)
        }
      })
      .then(res => res.json())
      .then(({isStarted, time, lastParseTime}) => {
        this.setState({isStarted, time, lastParseTime});
      })
  };
  render() {
    const {time, isStarted, isLoading, lastParseTime} = this.state;
    const addedRange = moment(time).fromNow(true);
    const addedRangeText = `${addedRange} назад`;
    const lastParseRange = moment(lastParseTime).fromNow(true);
    const lastParseText = `производилось ${lastParseRange} назад`;
    return (
      <div className='scannerPage'>
        <Loader size='large' active={isLoading} content='Loading' />
        <Header as='h1'>Сканер</Header>
          <Header as='h2'>
            <Icon name='searchengin' />
            <Header.Content>
              {isStarted ? `Сканер запущен` : `Сканер остановлен`}
              <Header.Subheader>{addedRangeText}</Header.Subheader>
            </Header.Content>
          </Header>
          {isStarted ?
            <Button secondary onClick={this.stop}>Остановить</Button>
            :
            <Button primary onClick={this.start}>Запустить</Button>
          }
          <Header as='h2'>
            <Icon name='history' />
            <Header.Content>
              Последнее сканирование
              <Header.Subheader>{lastParseText}</Header.Subheader>
            </Header.Content>
          </Header>
          <Button onClick={this.scan}>Сканировать</Button>
      </div>
    )
  }
};

export default connect(state => ({
  user: state.user
}))(ScannerPage);
