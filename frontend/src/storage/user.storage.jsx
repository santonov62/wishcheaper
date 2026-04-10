import { AUTH_DATA } from '../constants'

export const saveUser = (user) => {
  try {
    localStorage.setItem(AUTH_DATA, JSON.stringify(user));
    return user;
  }
  catch (error) {
    console.log('saveUser', error);
  }
};

export const clearUser = () => {
  try {
    localStorage.removeItem(AUTH_DATA);
  }
  catch (error) {
    console.log('clearUser', error);
  }
};

export const loadUser = () => {
  try {
    const serializedUser = localStorage.getItem(AUTH_DATA);
    if (!serializedUser) {
      return undefined;
    }
    const user = JSON.parse(serializedUser);
    return user;
  } catch (error) {
    return undefined;
  }
};
