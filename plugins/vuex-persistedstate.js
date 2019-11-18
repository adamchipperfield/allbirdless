import createPersistedState from 'vuex-persistedstate'
import Cookies from 'js-cookie';

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      storage: {
        getItem: (key) => Cookies.get(key),
        setItem: (key, value) => Cookies.set(key, value),
        removeItem: (key) => Cookies.remove(key),
      },
    })(store);

    store.dispatch('storeRehydrated');
  });
}