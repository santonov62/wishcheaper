import * as Actions from '../actions/goodsSearch.actions';
import * as Constants from '../constants';
import { ADD_ERROR } from "../actions/errors.actions";
import { authHeader } from '../helpers/auth-header';
import { authWithVk } from '../actionCreators/user.actionCreators';
import { userGoods } from "./goods.actionCreators";


const log = (text, params = '') => {
  console.log(`[goodsSearch.actionCreators] -> ${text}`, params);
};

const processError = (message, dispatch) => {
  // dispatch({type: Actions.GOODS_FAILURE});
  dispatch({
    type: ADD_ERROR,
    payload: {
      message: `[goodsSearch.actionCreators] ${message}`
    }
  });
};

export const setSearchTitle = (title) => async (dispatch, getState) => {
  try {
    // dispatch({type: Actions.TITLE});
    log(`[title]`, title);
    dispatch({
      type: Actions.TITLE,
      payload: {
        title
      }
    });
    return title;
  } catch (e) {
    processError(e.message, dispatch);
  }
};

export const setSearchShopId = (shopId) => async (dispatch, getState) => {
  try {
    // dispatch({type: Actions.TITLE});
    log(`[title]`, shopId);
    dispatch({
      type: Actions.SHOP_ID,
      payload: {
        shopId
      }
    });
    return shopId;
  } catch (e) {
    processError(e.message, dispatch);
  }
};