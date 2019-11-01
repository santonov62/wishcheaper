import * as Actions from '../actions/user.actions';
import {ADD_ERROR} from '../actions/errors.actions';
import * as Constants from "../constants";
import {clearUser, saveUser} from "../storage/user.storage";

const authByVk = async (session) => {
  return await fetch('/auth/vk', {
    method: 'POST',
    body: JSON.stringify(session),
    headers: {...Constants.REQUEST_JSON_HEADERS}
  })
  .then(response => response.json())
  .then(authData => {
    console.log('authByVk: ', authData);
    return authData;
  });
};

const loadVkSession = () => {
  return new Promise((resolve, reject) => {
    const vk_api = process.env.REACT_APP_VK_API_VERSION;
    const vk = window.VK;
    vk.Auth.login(({ session }) => {
      if (session) {
        vk.Api.call('users.get', {
          user_ids: session.mid,
          fields: ['photo_200', 'domain'],
          v: vk_api
        }, res => {
          const data = res && res.response && res.response[0];
          if(data) {
            const user = {
              ...session.user,
              photo: data.photo_200,
              login: data.domain
            };
            resolve({
              ...session,
              user: user
            });
          }
        });
      } else {
        reject(`Error load Vk session`);
      }
    });
  })
};

export const authWithVk = () => async (dispatch, getState) => {
  try {
    dispatch({ type: Actions.USER_LOADING });
    const vkSession = await loadVkSession();
    const authData = await authByVk(vkSession);
    if (!authData.user || !authData.token)
      throw new Error(authData);

    dispatch({
      type: Actions.USER_SIGNED_IN,
      payload: {
        ...authData.user,
        token: authData.token
      }
    });
    saveUser({
      user: getState().user
    });

  } catch (ex) {
    dispatch({type: Actions.USER_FAILURE});
    dispatch({
      type: ADD_ERROR,
      payload: {
        message: `[auth user] ${ex.message}`
      }
    });
  }

};

export const signOut = () => dispatch => {
    dispatch({type: Actions.USER_LOADING});

    const vk = window.VK;
    if (!!vk)
      vk.Auth.logout();

    clearUser();
    dispatch({type: Actions.USER_SIGNED_OUT});
};