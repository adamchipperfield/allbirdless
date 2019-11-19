<template>
  <div class="app-header">
    <ul class="app-header__nav">
      <li
        v-for="(item, index) in menuItems"
        :key="index"
      >
        <nuxt-link
          :to="item.url"
          class="app-header__link"
        >
          {{ item.title }}
        </nuxt-link>
      </li>
    </ul>

    <div class="app-header__logo">
      <app-logo />
    </div>

    <ul class="app-header__misc">
      <li>
        <currency-selector class="app-header__link" />
      </li>

      <li>
        <nuxt-link
          v-if="customerIsLoggedIn"
          to="/account"
        >
          <img
            :alt="$t('account.title')"
            src="~/assets/icons/icon-user.svg"
          >
        </nuxt-link>

        <nuxt-link
          v-else
          to="/account/login"
        >
          <img
            :alt="$t('account.login.title')"
            src="~/assets/icons/icon-user.svg"
          >
        </nuxt-link>
      </li>

      <li>
        <button
          class="app-header__cart"
          @click="toggleCartDrawer"
        >
          <img
            v-show="checkoutCount === 0"
            alt="Open cart drawer"
            src="~/assets/icons/icon-cart.svg"
          >

          <img
            v-show="checkoutCount > 0"
            alt="Open cart drawer"
            src="~/assets/icons/icon-cart-filled.svg"
          >

          <span class="app-header__cart-count">
            {{ checkoutCount }}
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/components/app-header';
</style>

<script>
import AppLogo from './AppLogo';
import CurrencySelector from './CurrencySelector';

export default {
  data() {
    return {
      menuItems: [
        {
          title: 'Men',
          url: '/collections/mens',
        },
        {
          title: 'Women',
          url: '/collections/womens',
        },
      ],
    };
  },
  components: {
    AppLogo,
    CurrencySelector,
  },
  methods: {

    /**
     * Toggles the cart drawer state.
     */
    toggleCartDrawer() {
      this.$root.$emit('cartDrawer:toggle');
    },
  },
  computed: {
    checkoutUrl() {
      return this.$store.state.checkout ? this.$store.state.checkout.webUrl : '';
    },
    checkoutCount() {
      return this.$store.state.checkout ? this.$store.state.checkout.lineItems.edges.length : 0;
    },
    customerIsLoggedIn({ app }) {
      return this.$cookies.get('access_token');
    },
  },
}
</script>