import React from 'react';
import './scannerPage.css'
import { Button, Header, Icon, Dimmer, Loader } from 'semantic-ui-react';
import moment from 'moment';

class ScannerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      time: null
    }
  }
  componentDidMount() {
    this.status();
  }
  status = () => {
    fetch(`checker/status`)
      .then(res => res.json())
      .then(({isActive, time}) => {
        this.setState({isActive, time});
      })
  };
  start = () => {
    fetch(`checker/start`)
      .then(res => res.json())
      .then(({isActive, time}) => {
        this.setState({isActive, time});
      })
  };
  stop = () => {
    fetch(`checker/stop`)
      .then(res => res.json())
      .then(({isActive, time}) => {
        this.setState({isActive, time});
      })
  };
  render() {
    const {time, isActive} = this.state;
    const addedRange = moment(time).fromNow(true);
    const addedRangeText = `${addedRange} назад`;
    return (
      <div className='scannerPage'>
        <Loader size='large' active={!time} content='Loading' />
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

export default ScannerPage;
