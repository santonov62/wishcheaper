import { AUTH_DATA } from '../constants'

export const saveUser = (user) => {
  try {
    sessionStorage.setItem(AUTH_DATA, JSON.stringify(user));
  }
  catch (error) {
    console.log('saveUser', error);
  }
};

export const clearUser = () => {
  try {
    sessionStorage.removeItem(AUTH_DATA);
  }
  catch (error) {
    console.log('clearUser', error);
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
