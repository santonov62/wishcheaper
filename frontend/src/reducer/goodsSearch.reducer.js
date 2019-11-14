import * as GoodsSearch from '../actions/goodsSearch.actions';

const initialState = {};

const goodsSearch = (state = initialState, action) => {
  switch(action.type) {
    case GoodsSearch.TITLE:
      const {title} = action.payload;
      return {
        ...state,
        title
      };
    case GoodsSearch.SHOP_ID:
      const {shopId} = action.payload;
      return {
        ...state,
        shopId
      };
    case GoodsSearch.ORDER_BY:
      break;
    default:
      return state
  }
};

export default goodsSearch;