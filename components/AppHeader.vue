<template>
  <div class="app-header">
    <div class="app-header__left">
      <button
        ref="menuToggle"
        class="app-header__menu-toggle"
        :class="{ 'is-active': menuDrawerActive }"
        @click="handleMenuToggleClick"
      >
        <span class="visually-hidden">Toggle menu drawer</span>
      </button>
    </div>

    <ul class="app-header__nav">
      <li
        v-for="(item, index) in $store.state.header.menu.fields.menuItem"
        :key="index"
      >
        <nuxt-link
          v-if="item.fields.internalUrl"
          :to="$getLocalePath(item.fields.internalUrl)"
          class="app-header__link"
        >
          {{ item.fields.label }}
        </nuxt-link>

        <a
          v-else
          class="app-header__link"
          :href="item.fields.url"
        >
          {{ item.fields.label }}
        </a>
      </li>
    </ul>

    <div class="app-header__logo">
      <app-logo />
    </div>

    <ul class="app-header__misc">
      <li>
        <language-selector class="app-header__currency-selector" />
      </li>

      <li>
        <currency-selector class="app-header__currency-selector" />
      </li>

      <li>
        <nuxt-link
          v-if="customerIsLoggedIn"
          :to="$getLocalePath('/account')"
          class="app-header__account"
        >
          <img
            :alt="$t('account.title')"
            src="~/assets/icons/icon-user.svg"
          >
        </nuxt-link>

        <nuxt-link
          v-else
          :to="$getLocalePath('/account/login')"
          class="app-header__account"
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
import LanguageSelector from './LanguageSelector';

export default {
  data() {
    return {
      menuDrawerActive: false,
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
    LanguageSelector,
  },
  mounted() {
    this.$root.$on('menuDrawer:closed', () => {
      this.menuDrawerActive = false;
    });

    this.$root.$on('menuDrawer:opened', () => {
      this.menuDrawerActive = true;
    });
  },
  methods: {

    /**
     * Toggles the cart drawer state.
     */
    toggleCartDrawer() {
      this.$root.$emit('cartDrawer:toggle');
    },

    /**
     * Handles the menu toggle click event.
     */
    handleMenuToggleClick() {
      this.$refs.menuToggle.classList.toggle('is-active');
      this.$root.$emit('menuDrawer:toggle');
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