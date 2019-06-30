import * as Actions from '../actions/shops.actions';

const initialState = [{
  isLoading: false,
  value: []
}];

const shopsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SHOPS_LOADING:
      return {
        isLoading: true,
        value: [],
      };
    case Actions.SHOPS_LOADED:
      return {
        isLoading: false,
        value: action.payload.shops
      };
    case Actions.SHOPS_SAVING:
    case Actions.SHOPS_DELETING:
    case Actions.SHOPS_UPDATING:
      return {
        isLoading: true,
        value: state.value,
      };
    case Actions.SHOPS_DELETED:
      const deletedShop = action.payload.shop;
      const filteredShops = state.value.filter(shop => shop.id !== deletedShop.id);
      return {
        isLoading: false,
        value: filteredShops
      };
    case Actions.SHOPS_SAVED:
      return {
        isLoading: false,
        value: state.value.concat(action.payload.shop)
      };
    case Actions.SHOPS_UPDATED:
      const {shop} = action.payload;
      const shopList = state.value.slice();
      const replaceIndex = shopList.findIndex(item => item.id === shop.id);
      shopList[replaceIndex] = shop;
      return {
        isLoading: false,
        value: shopList
      };
    case Actions.SHOPS_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default shopsReducer;
