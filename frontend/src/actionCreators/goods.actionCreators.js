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

// export const fetchPromo = () => (dispatch) => {
//   dispatch({ type: Actions.GOODS_LOADING });
//   return fetch('/promo/')
//     .then(response => response.json())
//     .then(promo => dispatch({
//       type: Actions.GOODS_LOADED,
//       payload: {promo}
//     }));
// };

export const userGoods = (params) => async (dispatch) => {
  try {
    dispatch({type: Actions.GOODS_LOADING});
    // let url = new URL(`${window.location.origin}/goods/`);
    // Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const {vk} = params;
    const result = await fetch(`/goods/user?vk=${vk}`, {
      method: 'GET'
    }).then(response => response.json());
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

// export const claimedPromo = ({ used } = {}) => async (dispatch, getState) => {
//   try {
//     dispatch({type: Actions.GOODS_LOADING});
//     const result = await fetch(`/promo/claimed?used=${used}`, {
//       method: 'GET',
//       headers: {
//         ...authHeader(getState().user)
//       }
//     }).then(response => response.json());
//     console.log('claimedPromo: ', result);
//     if (result.error)
//       throw new Error(`${result.error}`);
//     dispatch({
//       type: Actions.GOODS_LOADED,
//       payload: result
//     });
//     return result;
//   } catch (e) {
//     processError(e.message, dispatch);
//   }
// };

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

export const freePromo = (params) => async(dispatch) => {
  try {
    dispatch({type: Actions.GOODS_UPDATING});
    const result = await fetch('/promo/free', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {...Constants.REQUEST_JSON_HEADERS}
    }).then(res => res.json());
    if (result.error)
      throw new Error(`${result.error}`);
    dispatch({
      type: Actions.GOODS_UPDATED,
      payload: {promo: result}
    });
    return result;
  } catch (e) {
    processError(e.message, dispatch);
  }
};

export const deletePromo = ({ id }) => async (dispatch, getState) => {
  console.log('Delete promo item: ', {id});
  try {
    dispatch({type: Actions.GOODS_DELETING});
    const result = await fetch('/promo', {
      method: 'DELETE',
      body: JSON.stringify({id}),
      headers: {
        ...Constants.REQUEST_JSON_HEADERS,
        ...authHeader((getState().user))
      }
    }).then(res => res.json());
    if (result.error)
      throw new Error(`${result.error}`);
    dispatch({
      type: Actions.GOODS_DELETED,
      payload: {promo: result}
    });
    return result;
  } catch (e) {
    processError(e.message, dispatch);
  }
};

export const feedbackPromo = ({ id, valid = null, invalid = null }) => async (dispatch, getState) => {
  console.log('feedbackPromo: ', {id});
  try {
    dispatch({type: Actions.GOODS_UPDATING});
    const result = await fetch(`/promo/feedback`, {
      method: 'POST',
      body: JSON.stringify({id, valid, invalid}),
      headers: {
        ...authHeader(getState().user),
        ...Constants.REQUEST_JSON_HEADERS
      }
    }).then(res => res.json());

    if (result.error)
      throw new Error(`${result.error}`);

    dispatch({
      type: Actions.GOODS_UPDATED,
      payload: {
        promo: result
      }
    });
    return result;
  } catch (e) {
    processError(e.message, dispatch);
  }
};

export const buyPromo = ({promoId}) => async (dispatch) => {
  return new Promise((resolve, reject) => {
    const ws = window.ws;
    ws.once('onBuyPromo', ({promoItem, error}) => {
      console.log('onBuyPromo: ', promoItem);
      dispatch({
        type: Actions.GOODS_UPDATED,
        payload: {
          promo: promoItem
        }
      });
      if (error) {
        dispatch({
          type: ADD_ERROR,
          payload: {
            message: `buyPromo: ${error}`
          }
        });
        reject({error});
      } else {
        resolve({promoItem});
      }
    });
    ws.emit('buyPromo', {promoId});
  });
};

export const checkPromo = ({url, promoId}) => async(dispatch) => {
  console.log('checkPromo', {url, promoId});

  return new Promise((resolve, reject) => {
    const ws = window.ws;
    ws.once('onCheckPromo', ({error, success, incorrect, promoItem}) => {
      if (!!promoItem)
        dispatch({
          type: Actions.GOODS_UPDATED,
          payload: {
            promo: promoItem
          }
        });
      if (!!success || !!incorrect)
        resolve({success, incorrect});
      else
        reject({message: error});
      console.log('onCheckPromo: ', {error, success, incorrect});
    });

    ws.emit('checkPromo', {url, promoId});
  });
};