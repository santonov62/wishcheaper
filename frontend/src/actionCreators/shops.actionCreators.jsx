import * as Actions from '../actions/shops.actions';
import {SubmissionError} from 'redux-form';
import {ADD_ERROR} from "../actions/errors.actions";
import {authHeader} from '../helpers/auth-header';
import * as Constants from "../constants";

const processError = (message, dispatch) => {
  dispatch({type: Actions.SHOPS_FAILURE});
  dispatch({
    type: ADD_ERROR,
    payload: {
      message: `${message}`
    }
  });
};

export const allShops = () => (dispatch, getState) => {
  dispatch({ type: Actions.SHOPS_LOADING });
  fetch('/shops/', {
    method: 'GET',
    headers: {
      ...Constants.REQUEST_JSON_HEADERS,
      ...authHeader(getState().user)
    }
  })
    .then(response => response.json())
    .then(shops => dispatch({
      type: Actions.SHOPS_LOADED,
      payload: {
        shops
      }
    }));
};

const makeFormData = (shop) => {
  const data = new FormData();
  Object.keys(shop)
    .forEach(key => data.append(key, shop[key]));
  return data;
};

export const updateShop = ({id, scanInterval}) => async (dispatch, getState) => {
  try {
    dispatch({type: Actions.SHOPS_UPDATING});
    const shop = await fetch('/shops', {
      method: 'PUT',
      body: JSON.stringify({id, scanInterval}),
      headers: {
        ...Constants.REQUEST_JSON_HEADERS,
        ...authHeader(getState().user)
      }
    })
      .then(response => response.json());

    dispatch({
      type: Actions.SHOPS_UPDATED,
      payload: {
        shops: shop
      }
    });
    return shop;
  } catch (e) {
    processError(e.message, dispatch);
  }
};

export const deleteShop = shopId => async (dispatch, getState) => {
  try {
    dispatch({type: Actions.SHOPS_DELETING});
    const shop = await fetch(`/shops?id=${shopId}`, {
      method: 'DELETE',
      headers: {
          ...authHeader(getState().user)
      }
    }).then(response => response.json());

    if (shop.error)
      throw new Error(shop.error);

    dispatch({
      type: Actions.SHOPS_DELETED,
      payload: {
        shop
      }
    });
    return shop;
  } catch (e) {
    processError(e.message, dispatch);
  }
};

const handleErrors = (response) => {
  return new Promise((resolve, reject) => {
    if (response.ok) {
      return resolve(response);
    }

    const json = response.json();
    json.then(({ message }) => {
      return reject(message);
    });

  });
};
