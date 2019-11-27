import * as Actions from '../actions/subscriptions.actions';
import * as Constants from '../constants';
import { ADD_ERROR } from "../actions/errors.actions";
import { authHeader } from '../helpers/auth-header';


const log = (text, params = '') => {
  console.log(`[subscriptions.actionCreators] -> ${text}`, params);
};

const processError = (message, dispatch) => {
  dispatch({type: Actions.SUBSCRIPTIONS_FAILURE});
  dispatch({
    type: ADD_ERROR,
    payload: {
      message: `subscriptions: ${message}`
    }
  });
};

export const searchSubscriptions = (params) => async (dispatch, getState) => {
  try {
    // dispatch({type: GoodsActions.SUBSCRIPTIONS_LOADING});
    // let url = new URL(`${window.location.origin}/goods/`);
    // Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const {id} = params;
    const result = await fetch(`/subscriptions?id=${id}`, {
      method: 'GET',
      headers: {
        ...Constants.REQUEST_JSON_HEADERS,
        ...authHeader(getState().user)
      }
    }).then(response => response.json());
    log(`[searchSubscriptions]`, result);
    if (result.error)
      throw new Error(`${result.error}`);
    // dispatch({
    //   type: GoodsActions.SUBSCRIPTIONS_LOADED,
    //   payload: {
    //     goods: result
    //   }
    // });
    return result;
  } catch (e) {
    processError(e.message, dispatch);
  }
};

export const saveSubscriptions = ({id, price_discount, percent_discount, autobuy_price}) => async (dispatch, getState) => {
  dispatch({type: Actions.SUBSCRIPTIONS_SAVING});
  try {
    const subscription = await fetch(`/subscriptions`, {
      method: 'POST',
      body: JSON.stringify({
        id,
        price_discount,
        percent_discount,
        autobuy_price
      }),
      headers: {
        ...Constants.REQUEST_JSON_HEADERS,
        ...authHeader(getState().user)
      }
    }).then(response => response.json());
    
    dispatch({
      type: Actions.SUBSCRIPTIONS_SAVED,
      payload: {subscriptions: subscription}
    });
    return subscription;
  } catch (e) {
    processError(e.message, dispatch);
  }
};

export const removeSubscription = (goodId) => async (dispatch, getState) => {
  dispatch({type: Actions.SUBSCRIPTIONS_SAVING});
  try {
    const subscription = await fetch(`/subscriptions/unsubscribe`, {
      method: 'DELETE',
      body: JSON.stringify({goodId}),
      headers: {
        ...Constants.REQUEST_JSON_HEADERS,
        ...authHeader(getState().user)
      }
    }).then(response => response.json());

    dispatch({
      type: Actions.SUBSCRIPTIONS_SAVED,
      payload: {subscriptions: subscription}
    });
    return subscription;
  } catch (e) {
    processError(e.message, dispatch);
  }
};