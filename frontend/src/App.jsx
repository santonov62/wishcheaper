import React, { Fragment } from 'react';
import Helmet from 'react-helmet';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import reducers from './reducer/index.reducer';
import Header from './component/Header/Header';
import Footer from './component/Footer/Footer';
import AppLoader from './component/AppLoader';
import LoadingTracking from './component/LoadingTracking/LoadingTracking';
import ErrorsTracking from './component/ErrorsTracking/ErrorsTracking';
import VkCommunity from './component/VkCommunity';
import SocketCommunity from './component/SocketCommunity';
import LoginPage from './page/LoginPage';
import MainPage from './page/MainPage';
import ScannerPage from './page/ScannerPage';
import GoodsPage from './page/GoodsPage';
import ShopsPage from './page/ShopsPage';
import UnsubscribePage from './page/UnsubscribePage';
import AuthRoute from './component/AuthRoute';
import UserContextProvider from './component/UserContextProvider';
import { loadUser } from './storage/user.storage';

const App = () => {
  const persistedState = loadUser();
  const store = createStore(
    combineReducers({
      ...reducers,
    }),
    persistedState,
    composeWithDevTools(
      applyMiddleware(
        logger,
        thunk
      )
    )
  );

  return (
        <Provider store={store}>
          <Fragment>
            <Helmet
              defaultTitle='Единый список желаний'
              titleTemplate='%s - Единый список желаний'
              meta={[
                {
                  "name": "description",
                  "content": "Единый список желаний"
                }, {
                  'name': 'og:type',
                  'content': 'website'
                }
              ]}
            />
            <LoadingTracking/>
            <VkCommunity/>
            <SocketCommunity/>
            <AppLoader>
              <Router>
                <Fragment>
                  <UserContextProvider>
                    <Route path="/" component={ErrorsTracking}/>
                    {/*<Route path="/" component={VkCommunity}/>*/}
                    {/*<AuthRoute withoutRedirect path="/" component={Header}/>*/}
                    <Route exact path="/" component={MainPage}/>
                    <Route path="/login" component={LoginPage}/>
                    <AuthRoute exact path="/unsubscribe" component={UnsubscribePage}/>
                    <AuthRoute exact path="/my">
                      <Header />
                      <GoodsPage/>
                    </AuthRoute>
                    <AuthRoute adminRequired path="/scanner">
                      <Header />
                      <ScannerPage/>
                    </AuthRoute>
                    <AuthRoute adminRequired path="/manageShops">
                      <Header />
                      <ShopsPage />
                    </AuthRoute>
                    {/*<Route path="/" component={Footer}/>*/}
                  </UserContextProvider>
                </Fragment>
              </Router>
            </AppLoader>
          </Fragment>
        </Provider>
  )
};

export default App;
