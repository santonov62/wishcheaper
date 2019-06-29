import { AUTH_DATA } from '../constants'

export const saveUser = (user) => {
  try {
    sessionStorage.setItem(AUTH_DATA, JSON.stringify(user));
  }
  catch (error) {
    console.log('saveUser', error);
  }
};

export const loadUser = () => {
  try {
    const serializedUser = sessionStorage.getItem(AUTH_DATA);
    if (!serializedUser) {
      return undefined;
    }
    const user = JSON.parse(serializedUser);
    return user;
  } catch (error) {
    return undefined;
  }
};
