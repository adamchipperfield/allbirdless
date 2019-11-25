import Cookies from 'js-cookie';

import contentful from '~/plugins/contentful';

import checkoutCreate from '../graphql/mutations/checkoutCreate';
import checkoutLineItemsAdd from '../graphql/mutations/checkoutLineItemsAdd';
import checkoutLineItemsRemove from '../graphql/mutations/checkoutLineItemsRemove';
import checkoutLineItemsReplace from '../graphql/mutations/checkoutLineItemsReplace';
import checkoutCustomerAssociateV2 from '../graphql/mutations/checkoutCustomerAssociateV2';
import checkoutCustomerDisassociateV2 from '../graphql/mutations/checkoutCustomerDisassociateV2';
import customerAccessTokenCreate from '../graphql/mutations/customerAccessTokenCreate';
import customerAddressCreate from '../graphql/mutations/customerAddressCreate';
import customerAddressDelete from '../graphql/mutations/customerAddressDelete';
import customerAddressUpdate from '../graphql/mutations/customerAddressUpdate';
import customerCreate from '../graphql/mutations/customerCreate';
import getShopSettings from '../graphql/queries/getShopSettings';

/**
 * The store states.
 */
export const state = () => ({
  connected: false,
  checkout: {
    currencyCode: 'GBP',
    lineItems: {
      edges: [],
    },
  },
  header: {
    menu: {
      fields: {
        menuItem: [],
      },
    },
  },
  footer: {
    menus: [],
  },
  shop: {
    paymentSettings: {
      enabledCurrencies: [],
    },
  },
});

/**
 * Store mutations,
 */
export const mutations = {

  /**
   * Sets the connected state.
   * @param {object} state - The state.
   */
  SET_CONNECTED(state) {
    state.connected = state.checkout.id !== undefined;
  },

  /**
   * Sets the checkout object.
   * @param {object} state - The state.
   * @param {object} checkout - The checkout.
   */
  SET_CHECKOUT(state, checkout) {
    state.checkout = checkout;
    state.connected = true;
  },

  /**
   * Sets the shop object.
   * @param {object} state - The state.
   * @param {object} shop - The shop.
   */
  SET_SHOP_SETTINGS(state, shop) {
    state.shop = shop;
  },

  /**
   * Sets the footer menus object.
   * @param {object} state - The state.
   * @param {object} menus - The menus.
   */
  SET_FOOTER_MENUS(state, menus) {
    state.footer.menus = menus;
  },

  /**
   * Sets the header menu object.
   * @param {object} state - The state.
   * @param {object} menu - The menu.
   */
  SET_HEADER_MENU(state, menu) {
    state.header.menu = menu;
  },
};

/**
 * Store actions.
 */
export const actions = {

  /**
   * Runs when state is rehydrated.
   * - Entry point of the app.
   * - Used in place of nuxtServerInit.
   */
  async storeRehydrated({ state, dispatch, commit }) {
    commit('SET_CONNECTED');

    await dispatch('setShopSettings');
    await dispatch('setFooterMenus');
    await dispatch('setHeaderMenu');

    if (!state.connected) {
      await dispatch('createCheckout');
      return;
    }
  },

  /**
   * Creates a new checkout.
   * @param {object} - The app context.
   * @returns {Promise} - The checkout promise.
   */
  createCheckout({ commit, state }, currencyCode = 'GBP') {
    const client = this.app.apolloProvider.defaultClient;

    const lineItems = state.connected ? state.checkout.lineItems.edges.map((item) => {
      return {
        variantId: item.node.variant.id || item.node.id,
        quantity: item.node.quantity,
      }
    }) : [];

    return client.mutate({
      mutation: checkoutCreate,
      variables: {
        input: {
          lineItems,
          presentmentCurrencyCode: currencyCode,
        },
      },
    })
      .then(({ data }) => {
        const checkout = data.checkoutCreate.checkout;
        commit('SET_CHECKOUT', checkout);
      })
  },

  /**
   * Associates a customer with the current checkout.
   * @param {object} param0 - The app context.
   * @param {string} accessToken - The customer.
   */
  addCustomerToCheckout({ state }, accessToken) {
    const client = this.app.apolloProvider.defaultClient;

    if (!state.connected) {
      return;
    }

    return client.mutate({
      mutation: checkoutCustomerAssociateV2,
      variables: {
        checkoutId: state.checkout.id,
        customerAccessToken: accessToken,
      },
    });
  },

  /**
   * Disassociates a customer from the current checkout.
   * @param {object} param0 - The app context.
   */
  removeCustomerFromCheckout({ state }) {
    const client = this.app.apolloProvider.defaultClient;

    if (!state.connected) {
      return;
    }

    return client.mutate({
      mutation: checkoutCustomerDisassociateV2,
      variables: {
        checkoutId: state.checkout.id,
      },
    });
  },

  /**
   * Updates the active currency.
   * - Currently creates a new checkout with the updated currency code.
   * - There is no current way to update a checkout's currency.
   * @param {object} - The app context.
   * @returns {string} - The currency code.
   */
  updateActiveCurrency({ dispatch }, currencyCode) {
    dispatch('createCheckout', currencyCode);
  },

  /**
   * Set shop settings.
   * @param {object} - The app context.
   */
  setShopSettings({ commit }) {
    const client = this.app.apolloProvider.defaultClient;

    return client.query({
      query: getShopSettings,
    })
      .then(({ data }) => {
        const shop = data.shop;
        commit('SET_SHOP_SETTINGS', shop);
      });
  },

  /**
   * Set the footer menus.
   * @param {object} - The app context.
   */
  setFooterMenus({ commit }) {
    return contentful.getEntries({
      'sys.id': '67EsiibMocwXOqzHX3rnkx',
      content_type: 'menuGroup',
      include: 2,
    })
      .then((response) => {
        commit('SET_FOOTER_MENUS', response.items[0].fields.menus);
      });
  },

  /**
   * Set the header menu.
   * @param {object} - The app context.
   */
  setHeaderMenu({ state, commit }) {
    return contentful.getEntries({
      'sys.id': '4wFPqeExdvi9URldIEcyXR',
      content_type: 'navigationMenu',
      include: 2,
      locale: state.i18n.locale,
    })
      .then((response) => {
        commit('SET_HEADER_MENU', response.items[0]);
      });
  },

  /**
   * Adds a variant to the cart.
   * @param {object} - The app context.
   * @returns {Promise} - The checkout promise.
   */
  addVariantToCart({ state, commit }, { variantId, quantity }) {
    const client = this.app.apolloProvider.defaultClient;

    return client.mutate({
      mutation: checkoutLineItemsAdd,
      variables: {
        checkoutId: state.checkout.id,
        lineItems: {
          variantId,
          quantity: parseInt(quantity, 10),
        },
      },
    })
      .then(({ data }) => {
        const checkout = data.checkoutLineItemsAdd.checkout;
        commit('SET_CHECKOUT', checkout);
      });
  },

  /**
   * Removes a line item from the cart.
   * @param {object} param0 - The app context.
   * @param {string} id - The line item ID.
   */
  removeLineItem({ state, commit }, id) {
    const client = this.app.apolloProvider.defaultClient;

    return client.mutate({
      mutation: checkoutLineItemsRemove,
      variables: {
        checkoutId: state.checkout.id,
        lineItemIds: [id],
      },
    })
      .then(({ data }) => {
        const checkout = data.checkoutLineItemsRemove.checkout;
        commit('SET_CHECKOUT', checkout);
      });
  },

  /**
   * Updates the line item quantity.
   * @param {object} param0 - The context.
   * @param {object} param1 - The line item.
   */
  updateLineItemQuantity({ state, commit }, { variantId, quantity }) {
    const client = this.app.apolloProvider.defaultClient;
    const lineItems = state.checkout.lineItems.edges.map((item) => item.node);

    const updateLineItems = lineItems.map((item) => {
      return {
        variantId: item.variant.id,
        quantity:
          item.variant.id === variantId ? quantity : item.quantity,
      }
    });

    return client.mutate({
      mutation: checkoutLineItemsReplace,
      variables: {
        checkoutId: state.checkout.id,
        lineItems: updateLineItems,
      },
    })
      .then(({ data }) => {
        const checkout = data.checkoutLineItemsReplace.checkout;
        commit('SET_CHECKOUT', checkout);
      });
  },

  /**
   * Creates a new customer on the store.
   * @param {object} param0 - The app context.
   * @param {object} param1 - The account data.
   */
  createCustomer({}, { email, password }) {
    const client = this.app.apolloProvider.defaultClient;

    return client.mutate({
      mutation: customerCreate,
      variables: {
        input: {
          email,
          password,
        }
      },
    })
      .then(() => {
        this.$router.push(this.$getLocalePath('/account/login'));
      })
  },

  /**
   * Handles the customer login event.
   * @param {object} param0 - The app context.
   * @param {object} param1 - The login data.
   */
  loginCustomer({ dispatch }, { email, password }) {
    const client = this.app.apolloProvider.defaultClient;

    return client.mutate({
      mutation: customerAccessTokenCreate,
      variables: {
        input: {
          email,
          password,
        },
      },
    })
      .then(async ({ data }) => {
        const access = data.customerAccessTokenCreate.customerAccessToken;
        
        if (!access) {
          this.$root.$emit('login:failed');
          return;
        }

        Cookies.set('access_token', access.accessToken, { expires: new Date(access.expiresAt) });
        dispatch('addCustomerToCheckout', access.accessToken);
        this.$router.push(this.$getLocalePath('/account'));
      });
  },

  /**
   * Logs out the customer.
   * - Removes access token.
   */
  logoutCustomer({ dispatch }) {
    dispatch('removeCustomerFromCheckout');
    Cookies.remove('access_token');
    this.$router.push(this.$getLocalePath('/account/login'));
  },

  /**
   * Deletes a customer address.
   * @param {object} param0 - Context.
   * @param {string} id - The address ID.
   */
  deleteCustomerAddress({}, id) {
    const client = this.app.apolloProvider.defaultClient;

    return client.mutate({
      mutation: customerAddressDelete,
      variables: {
        id,
        customerAccessToken: Cookies.get('access_token'),
      },
    });
  },

  /**
   * Updates one of the customers' addresses.
   * @param {object} param0 - The context.
   * @param {string} id - The address ID.
   * @param {object} address - The address object.
   */
  updateCustomerAddress({}, { id, address }) {
    const client = this.app.apolloProvider.defaultClient;

    return client.mutate({
      mutation: customerAddressUpdate,
      variables: {
        customerAccessToken: Cookies.get('access_token'),
        id,
        address,
      },
    });
  },

  /**
   * Creates a customer address.
   * @param {object} param0 - The context.
   * @param {object} address - The address object.
   */
  createCustomerAddress({}, address) {
    const client = this.app.apolloProvider.defaultClient;

    return client.mutate({
      mutation: customerAddressCreate,
      variables: {
        customerAccessToken: Cookies.get('access_token'),
        address,
      },
    });
  },
};