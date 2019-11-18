<template>
  <div class="layout-default">
    <app-header />
      <nuxt />
    <app-footer />
    <cart-drawer />
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/layouts/default';
</style>

<script>
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import CartDrawer from '../components/CartDrawer';

export default {
  components: {
    AppHeader,
    AppFooter,
    CartDrawer,
  }
}
</script>