import * as Actions from "../actions/vk.actions";
import {ADD_ERROR} from "../actions/errors.actions";

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