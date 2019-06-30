import * as Actions from '../actions/vk.actions';

const initialState = {
  isApiInited: false
};

const vkReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.API_INITED:
      return {
        isApiInited: true
      };
  
    default:
      return state;
  }
};

export default vkReducer;