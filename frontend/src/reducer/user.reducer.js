import * as Actions from '../actions/user.actions';

const initialState = {
  id: null,
  name: null,
  email: null,
  photo: null,
  isLoading: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.USER_SIGNED_IN:
      return {
        ...state,
        ...action.payload,
        isLoading: false,
      };
    case Actions.USER_FAILURE:
      return {
        ...state,
        isLoading: false
      };
    case Actions.USER_SIGNED_OUT:
      return { ...initialState };
    case Actions.USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
};

export default userReducer;
