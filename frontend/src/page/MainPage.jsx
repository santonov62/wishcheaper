import React, { Fragment } from 'react';
import { Container, Header } from 'semantic-ui-react';
import './mainPage.css';
import { connect } from 'react-redux';
import SignInWithVkButton from '../component/SignInWithVkButton';
import { authWithVk, signOut } from '../actionCreators/user.actionCreators';
import { Navigate, useLocation } from 'react-router-dom';

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goods_count: '--',
      week_goods_count: '--',
      users_count: '--'
    };
  }

  componentDidMount() {
    fetch(`/goods/statistic`)
      .then(res => res.json())
      .then(statistic => this.setState({ ...statistic }));
  }

  render() {
    const { user, locationState } = this.props;
    const { goods_count, week_goods_count, users_count } = this.state;
    const from = locationState && locationState.from;

    return (
      <Fragment>
        {!!user && user.id && (
          <Fragment>
            {!!from ?
              <Navigate to={{
                pathname: from.pathname,
                search: from.search
              }} replace />
              :
              <Navigate to='/my' replace />
            }
          </Fragment>
        )}
        {(!user || !user.id) &&
          <div className='mainPage'>
            <div className='title'>Покупайте любимые товары дешевле</div>

            <Container text className="about">
              <Header as='h3' style={{ fontSize: '2em' }}>
                Как это работает
              </Header>
              <ol type="1">
                <li>Вы добавляете интересующие вас товары к себе в список отслеживаемых</li>
                <li>Мы следим за изменениями цены на товар и как только она снижается уведомляем вас сообщением</li>
                <li>Вы один из первых узнаете о снижении цены без необходимости лично следить за ней</li>
              </ol>
            </Container>

            <SignInWithVkButton size='massive' text='Авторизироваться' />

            <div className='statistic'>
              <br />
              <br />
              <br />
              <br />
              <div className='stats'>
                <div className='number'>
                  <div className='decorHeader'>{goods_count}</div>
                  Отслеживаемых товаров
                </div>
                <div className='number'>
                  <div className='decorHeader'>{week_goods_count}</div>
                  Новых за неделю
                </div>
                <div className='number'>
                  <div className='decorHeader'>{users_count}</div>
                  Пользователей
                </div>
              </div>
            </div>
          </div>
        }
      </Fragment>
    );
  }
}

const MainPageWrapper = (props) => {
  const location = useLocation();
  return <MainPage {...props} locationState={location.state} />;
};

const mapState = (state) => ({
  user: state.user
});

export default connect(mapState)(MainPageWrapper);
