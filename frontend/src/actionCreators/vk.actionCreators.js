import * as Actions from "../actions/vk.actions";
import * as UserActions from '../actions/user.actions';
import {ADD_ERROR} from "../actions/errors.actions";
import {authWithVk, signOut} from "../actionCreators/user.actionCreators";
import {clearUser} from "../storage/user.storage";

const processError = (message, dispatch) => {
    dispatch({type: Actions.API_FAILURE});
    dispatch({
        type: ADD_ERROR,
        payload: {
            message: `Vk api: ${message}`
        }
    });
};

export const apiInit = () => dispatch => {
    try {
        const apiId = process.env.REACT_APP_VK_APP_ID;
        if (!apiId) {
            throw new Error('Setup REACT_APP_VK_APP_ID env variable');
        }
        const vk = window.VK;
        vk.init({apiId});
    
        dispatch({
            type: Actions.API_INITED
        });

        vk.Auth.getLoginStatus(({session}) => {
            if (!session) {
              clearUser();
              dispatch({type: UserActions.USER_SIGNED_OUT});
            } else {
                console.log('[apiInit]', session)
            }
        });

    } catch (e) {
        processError(e.message, dispatch);
    }
};

export const apiError = () => dispatch => {
    dispatch({
        type: Actions.API_ERROR,
        payload: {
            isApiInited: false
        }
    });
    processError(`Vk api init error`, dispatch);
};