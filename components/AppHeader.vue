<template>
  <div class="site-header">
    <app-logo />
    <a :href="checkoutUrl">{{ $t('checkout.title') }} ({{ checkoutCount }})</a>

    <ul>
      <li
        v-for="(item, index) in menuItems"
        :key="index"
      >
        <nuxt-link :to="item.url">{{ item.title }}</nuxt-link>
      </li>
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

<script>
import AppLogo from './AppLogo';

export default {
  data() {
    return {
      menuItems: [
        {
          title: 'Home',
          url: '/',
        },
        {
          title: 'Womens',
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