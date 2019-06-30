import React, {Fragment} from 'react';
import moment from 'moment';
import './countdown.css';

class Countdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      day: 0,
      hour: 0,
      min: 0,
      sec: 0
    }
  }
  componentDidMount() {
    const {hours, minutes, seconds} = this.props;
    const tl = moment(new Date(), "DD-MM-YYYY");
    if (hours)
      tl.add(hours, 'hours');
    if (minutes)
      tl.add(minutes, 'minutes');
    if (seconds)
      tl.add(seconds, 'seconds');
    this.countDown(tl);
  };
  addZero = (num) => {
    return ('0'+num).slice(-2);
  };
  countDown = (tl) => {
    const today=new Date();
    const day=Math.floor((tl-today)/(24*60*60*1000));
    const hour=Math.floor(((tl-today)%(24*60*60*1000))/(60*60*1000));
    const min=Math.floor(((tl-today)%(24*60*60*1000))/(60*1000))%60;
    const sec=Math.floor(((tl-today)%(24*60*60*1000))/1000)%60%60;
    const isTimeGoing = (tl - today) > 0;
    this.setState({ day, hour, min, sec, isTimeGoing });

    if (isTimeGoing) {
      setTimeout(() => {
        this.countDown(tl);
      }, 1000);
    }
  };
  render() {
    const {text} = this.props;
    const {min, sec, isTimeGoing} = this.state;
    return (
      <Fragment>
        <div style={{textAlign: 'center'}}>{text}</div>
        <div className='countdown'>
          {!isTimeGoing && <TimeIsUp /> }
          {isTimeGoing &&
          <Fragment>
            <Digit value={this.addZero(min)}/>
            <Digit value={this.addZero(sec)}/>
          </Fragment>
          }
        </div>
      </Fragment>
    );
  }
}

/*

 */
const Digit = ({value}) => (
  <span className="number-wrapper">
    <div className="line"></div>
    {/*<div className="caption">SECS</div>*/}
    <span className="number">{value}</span>
  </span>
);

/*

 */
const TimeIsUp = () => (
  <span className="number-wrapper">
    <div className="line"></div>
    <span className="number end">Time is up!</span>
  </span>
);

export default Countdown;