import * as Actions from '../actions/goods.actions';

const initialState = {
  isLoading: false,
  value: []
};

const codesReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.GOODS_LOADING:
      return {
        isLoading: true,
        value: [],
      };
    case Actions.GOODS_LOADED:
      return {
        isLoading: false,
        value: state.value.concat(action.payload.goods)
      };
    case Actions.GOODS_SAVED:
      const goods = state.value.slice();
      const savedGood = action.payload.goods;
      const isExist = state.value.find(({id}) => savedGood.id === id);
      if (!isExist)
        goods.unshift(savedGood);
      return {
        isLoading: false,
        value: goods
      };
    case Actions.GOODS_SAVING:
    // case Actions.GOODS_UPDATING:
    // case Actions.GOODS_DELETING:
      return {
        isLoading: true,
        value: state.value,
      };
    // case Actions.GOODS_UPDATED:
    //   const promoList = state.value.slice();
    //   const promo = action.payload.goods;
    //   const replaceIndex = promoList.findIndex(item => item.id === promo.id);
    //   promoList[replaceIndex] = promo;
    //   return {
    //     isLoading: false,
    //     value: promoList,
    //   };
    // case Actions.GOODS_DELETED:
    //   const filteredPromoList = state.value.filter(item => item.id !== action.payload.goods.id);
    //   return {
    //     isLoading: false,
    //     value: filteredPromoList,
    //   };
    case Actions.GOODS_FAILURE:
      return {
        value: state.value,
        isLoading: false
      };
    default:
      return state;
  }
};

export default codesReducer;
