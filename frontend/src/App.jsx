import React, { Fragment } from 'react';
import Helmet from 'react-helmet';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import reducers from './reducer/index.reducer';
import Header from './component/Header/Header';
import AppLoader from './component/AppLoader';
import LoadingTracking from './component/LoadingTracking/LoadingTracking';
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
import ErrorsTracking from './component/ErrorsTracking/ErrorsTracking';

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
              name: 'description',
              content: 'Единый список желаний'
            },
            {
              name: 'og:type',
              content: 'website'
            }
          ]}
        />
        <LoadingTracking />
        <VkCommunity />
        <SocketCommunity />
        <ErrorsTracking />
        <AppLoader>
          <Router>
            <Fragment>
              <UserContextProvider>
                <Routes>
                  <Route exact path="/" element={<MainPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/u" element={<AuthRoute><UnsubscribePage /></AuthRoute>} />
                  <Route path="/my" element={
                    <AuthRoute>
                      <Header />
                      <GoodsPage />
                    </AuthRoute>
                  } />
                  <Route path="/scanner" element={
                    <AuthRoute adminRequired>
                      <Header />
                      <ScannerPage />
                    </AuthRoute>
                  } />
                  <Route path="/manageShops" element={
                    <AuthRoute adminRequired>
                      <Header />
                      <ShopsPage />
                    </AuthRoute>
                  } />
                </Routes>
              </UserContextProvider>
            </Fragment>
          </Router>
        </AppLoader>
      </Fragment>
    </Provider>
  );
};

export default App;
