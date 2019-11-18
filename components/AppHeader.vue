<template>
  <div class="app-header">
    <ul class="app-header__nav">
      <li
        v-for="(item, index) in menuItems"
        :key="index"
        class="app-header__nav-link"
      >
        <nuxt-link :to="item.url">{{ item.title }}</nuxt-link>
      </li>
    </ul>

    <div class="app-header__logo">
      <app-logo />
    </div>

    <ul class="app-header__misc">
      <li>
        <nuxt-link
          v-if="customerIsLoggedIn"
          to="/account"
        >
          {{ $t('account.title') }}
        </nuxt-link>

        <nuxt-link
          v-else
          to="/account/login"
        >
          {{ $t('account.login.title') }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/components/app-header';
</style>

<script>
import AppLogo from './AppLogo';

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