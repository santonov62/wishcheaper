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
import AppLoader from './component/AppLoader';
import LoadingTracking from './component/LoadingTracking/LoadingTracking';
// import ErrorsTracking from './component/ErrorsTracking/ErrorsTracking';
import LoginPage from './page/LoginPage';
import MainPage from './page/MainPage';
import ScannerPage from './page/ScannerPage';
import GoodsPage from './page/GoodsPage';
import AuthRoute from './component/AuthRoute';
import UserContextProvider from './component/UserContextProvider';
import { loadUser, saveUser } from './storage/user.storage';

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

  store.subscribe(() => {
    saveUser({
      user: store.getState().user
    })
  });

  return (
        <Provider store={store}>
          <Fragment>
            <Helmet
              defaultTitle='Сканер цен'
              titleTemplate='%s - Сканер цен'
              meta={[
                {
                  "name": "description",
                  "content": "Сканер цен"
                }, {
                  'name': 'og:type',
                  'content': 'website'
                }
              ]}
            />
            <LoadingTracking/>
            <AppLoader>
              <Router>
                <Fragment>
                  <UserContextProvider>
                    <AuthRoute withoutRedirect path="/" component={Header}/>
                    <Route exact path="/" component={MainPage}/>
                    <Route path="/login" component={LoginPage}/>
                    <AuthRoute exact path="/mylist" component={GoodsPage}/>
                    <AuthRoute adminRequired path="/scanner" component={ScannerPage}/>
                  </UserContextProvider>
                </Fragment>
              </Router>
            </AppLoader>
            {/*<ErrorsTracking/>*/}
          </Fragment>
        </Provider>
  )
};

export default App;
