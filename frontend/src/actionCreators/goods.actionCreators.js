import * as Actions from '../actions/goods.actions';
import * as Constants from '../constants';
import { ADD_ERROR } from "../actions/errors.actions";
import { authHeader } from '../helpers/auth-header';


const log = (text, params = '') => {
  console.log(`[goods.actionCreators] -> ${text}`, params);
};

const processError = (message, dispatch) => {
  dispatch({type: Actions.GOODS_FAILURE});
  dispatch({
    type: ADD_ERROR,
    payload: {
      message: `promos: ${message}`
    }
  });
};

export const userGoods = () => async (dispatch, getState) => {
  try {
    dispatch({type: Actions.GOODS_LOADING});
    const result = await fetch(`/goods/my`, {
      method: 'GET',
      headers: {
        ...Constants.REQUEST_JSON_HEADERS,
        ...authHeader(getState().user)
      }
    })
        .then(response => response.json());
    log(`[userGoods]`, result);
    if (result.error)
      throw new Error(`${result.error}`);
    dispatch({
      type: Actions.GOODS_LOADED,
      payload: {
        goods: result
      }
    });
    return result;
  } catch (e) {
    processError(e.message, dispatch);
  }
};

export const searchGoods = (params) => async (dispatch) => {
  try {
    dispatch({type: Actions.GOODS_LOADING});
    let url = new URL(`${window.location.origin}/goods/`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const result = await fetch(url, {
      method: 'GET'
    }).then(response => response.json());
    log(`[searchPromo]`, result);
    if (result.error)
      throw new Error(`${result.error}`);
    dispatch({
      type: Actions.GOODS_LOADED,
      payload: {
        goods: result
      }
    });
    return result;
  } catch (e) {
    processError(e.message, dispatch);
  }
};

export const saveGood = ({url}) => async (dispatch) => {
  dispatch({type: Actions.GOODS_SAVING});
  try {
    const good = await fetch('/goods', {
      method: 'POST',
      body: JSON.stringify({url}),
      headers: {...Constants.REQUEST_JSON_HEADERS}
    }).then(response => response.json());
    
    dispatch({
      type: Actions.GOODS_SAVED,
      payload: {goods: good}
    });
    return good;
  } catch (e) {
    processError(e.message, dispatch);
  }
};

export const addByUrl = (url) => async (dispatch, getState) => {
  dispatch({type: Actions.GOODS_SAVING});
  try {
    const good = await fetch(`checker/add`, {
      method: 'POST',
      body: JSON.stringify({
        url
      }),
      headers: {
        ...Constants.REQUEST_JSON_HEADERS,
        ...authHeader(getState().user)
      }
    }).then(res => res.json());
    dispatch({
      type: Actions.GOODS_SAVED,
      payload: {goods: good}
    });
    return good;
  } catch (e) {
    processError(e.message, dispatch);
  }
};

export const updatePromo = (params) => (dispatch) => {
  dispatch({type: Actions.GOODS_UPDATING});
  return fetch('/promo', {
    method: 'PUT',
    body: JSON.stringify(params),
    headers: {...Constants.REQUEST_JSON_HEADERS}
  })
    .then(response => response.json())
    .then(data => {
      if(data.success) {
        const {promo} = data;
        dispatch({
          type: Actions.GOODS_UPDATED,
          payload: {promo}
        });
      }
      return data;
    })
};

export const removeGood = ({ id }) => async (dispatch, getState) => {
  console.log('Delete good item: ', {id});
  try {
    dispatch({type: Actions.GOODS_DELETING});
    const subscription = await fetch('/subscriptions', {
      method: 'DELETE',
      body: JSON.stringify({goodId: id}),
      headers: {
        ...Constants.REQUEST_JSON_HEADERS,
        ...authHeader(getState().user)
      }
    }).then(res => res.json());
    
    if (!!subscription.error)
      throw new Error(`${subscription.error}`);
    
    dispatch({
      type: Actions.GOODS_DELETED,
      payload: {goods: {
        id: subscription.good_id
        }}
    });
    return subscription;
    
  } catch (e) {
    processError(e.message, dispatch);
  }
};