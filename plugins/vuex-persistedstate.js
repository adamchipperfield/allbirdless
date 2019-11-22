import createPersistedState from 'vuex-persistedstate'

export default ({ store, app }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      storage: window.sessionStorage,
    })(store);

    store.dispatch('storeRehydrated');
  });
}