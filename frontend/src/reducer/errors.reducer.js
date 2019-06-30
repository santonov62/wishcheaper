import * as Actions from '../actions/errors.actions';

const initialState = [];

const errorsReducer = (state = initialState, action) => {
  switch (action.type) {

    case Actions.ADD_ERROR:
      return state.concat([action.payload]);

    case Actions.REMOVE_ERROR:
      return state.filter((error, i) => i !== action.index);

    case Actions.CLEAR_ERROR:
      return [];

    default:
      return state;
  }
};

export default errorsReducer;