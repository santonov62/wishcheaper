import * as GoodsActions from '../actions/goods.actions';
import * as SubscriptionsActions from '../actions/subscriptions.actions';

const initialState = {
  isLoading: false,
  value: []
};

const goodsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GoodsActions.GOODS_LOADING:
      return {
        isLoading: true,
        value: [],
      };
    case GoodsActions.GOODS_LOADED:
      return {
        isLoading: false,
        value: state.value.concat(action.payload.goods)
      };
    case GoodsActions.GOODS_SAVED:
      const goods = state.value.slice();
      const savedGood = action.payload.goods;
      const isExist = state.value.find(({id}) => savedGood.id === id);
      if (!isExist)
        goods.unshift(savedGood);
      return {
        isLoading: false,
        value: goods
      };
    case GoodsActions.GOODS_SAVING:
    // case GoodsActions.GOODS_UPDATING:
    case GoodsActions.GOODS_DELETING:
      return {
        isLoading: true,
        value: state.value,
      };
    // case GoodsActions.GOODS_UPDATED:
    //   const promoList = state.value.slice();
    //   const promo = action.payload.goods;
    //   const replaceIndex = promoList.findIndex(item => item.id === promo.id);
    //   promoList[replaceIndex] = promo;
    //   return {
    //     isLoading: false,
    //     value: promoList,
    //   };
    case GoodsActions.GOODS_DELETED:
      const filteredGoods = state.value.filter(good => good.id !== action.payload.goods.id);
      return {
        isLoading: false,
        value: filteredGoods,
      };
    case GoodsActions.GOODS_FAILURE:
      return {
        value: state.value,
        isLoading: false
      };
    case SubscriptionsActions.SUBSCRIPTIONS_SAVED:
      const allGoods = state.value.slice();
      const savedSubscription = action.payload.subscriptions;
      let good = allGoods.find((good) => good.id === savedSubscription.good_id);
      if (!!good) {
        good.price_discount = savedSubscription.price_discount;
        good.percent_discount = savedSubscription.percent_discount;
        good.autobuy_price = savedSubscription.autobuy_price;
      }
      return {
        isLoading: false,
        value: allGoods
      };
    default:
      return state;
  }
};

export default goodsReducer;
