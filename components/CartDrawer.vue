<template>
  <div class="cart-drawer">
    <h3>{{ $t('cartDrawer.title') }}</h3>
    <div
      v-for="(item, index) in lineItems"
      :key="index"
      class="cart-drawer__item"
    >
      {{ item.title }} x {{ item.quantity }}
      <span @click="removeLineItem(item.id)">{{ $t('cartDrawer.lineItems.remove') }}</span>
    </div>

    <a
      v-if="lineItems.length > 0"
      :href="checkoutUrl"
    >
      {{ $t('cartDrawer.checkout') }}
    </a>
  </div>
</template>

<script>
export default {
  methods: {

    /**
     * Removes the line item.
     * @param {string} id - The line item ID.
     */
    removeLineItem(id) {
      this.$store.dispatch('removeLineItem', id);
    },
  },
  computed: {
    checkoutUrl() {
      return this.$store.state.checkout ? this.$store.state.checkout.webUrl : '';
    },
    lineItems() {
      return this.$store.state.checkout ? this.$store.state.checkout.lineItems.edges.map((item) => item.node) : [];
    },
  },
}
</script>