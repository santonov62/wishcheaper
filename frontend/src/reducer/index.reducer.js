// import shopsReducer from './shops.reducer';
import goodsReducer from './goods.reducer';
// import currencyReducer from './currency.reducer';
import userReducer from './user.reducer';
import errorsReducer from './errors.reducer';
import vkReducer from './vk.reducer';
// import paymentsReducer from './payments.reducer';
import { reducer as form } from 'redux-form';

export default {
  // shops: shopsReducer,
  goods: goodsReducer,
  // currency: currencyReducer,
  user: userReducer,
  errors: errorsReducer,
  vk: vkReducer,
  // payments: paymentsReducer,
  form,
}
