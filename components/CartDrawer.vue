<template>
  <div
    class="cart-drawer"
    :class="{ 'is-active': isActive }"
  >
    <div class="cart-drawer__body">
      <div class="cart-drawer__header">
        <button
          class="cart-drawer__close"
          @click="close"
        >
          <span class="visually-hidden">Close cart drawer</span>
        </button>
      </div>

      <div
        v-for="(item, index) in lineItems"
        :key="index"
        class="cart-drawer__item"
      >
        <img
          v-if="item.variant.image"
          :src="item.variant.image.transformedSrc"
          :alt="item.title"
        >

        <div class="cart-drawer__item-details">
          <p class="cart-drawer__item-title">{{ item.title }}</p>
          <p class="cart-drawer__item-variant">{{ item.variant.title }}</p>

          <div class="cart-drawer__item-footer">
            <quantity-selector
              :defaultQuantity="item.quantity"
              @quantityChanged="updateQuantity(item.variant.id, $event)"
            />

            <product-price
              class="cart-drawer__item-price"
              :presentmentPrices="item.variant.presentmentPrices"
              :currency="$store.state.checkout.currencyCode"
            />
          </div>

          <span
            class="cart-drawer__item-remove"
            @click="removeLineItem(item.id)"
          >
            <span class="visually-hidden">{{ $t('cartDrawer.lineItems.remove') }}</span>
          </span>
        </div>
      </div>
    </div>

    <div class="cart-drawer__footer">
      <a
        v-if="lineItems.length > 0"
        :href="checkoutUrl"
        class="button button--block"
      >
        {{ $t('cartDrawer.checkout') }}
      </a>
    </div>
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/components/cart-drawer';
</style>

<script>
import ProductPrice from '~/components/ProductPrice';
import QuantitySelector from '~/components/QuantitySelector';

export default {
  data() {
    return {
      isActive: false,
    }
  },
  components: {
    ProductPrice,
    QuantitySelector,
  },
  mounted() {
    this.$root.$on('cartDrawer:toggle', () => this.toggle());
    this.$root.$on('windowOverlay:click', () => this.close());
  },
  methods: {

    /**
     * Removes the line item.
     * @param {string} id - The line item ID.
     */
    removeLineItem(id) {
      this.$store.dispatch('removeLineItem', id);
    },

    /**
     * Updates the quantity of the line item.
     * @param {string} variantId - The line item ID.
     * @param {integer} quantity - The line item quantity.
     */
    updateQuantity(variantId, quantity) {
      this.$store.dispatch('updateLineItemQuantity', { variantId, quantity });
    },

    /**
     * Toggles the cart drawer.
     */
    toggle() {
      return this.isActive ? this.close() : this.open();
    },

    /**
     * Set active state.
     */
    open() {
      this.isActive = true;
      this.$root.$emit('menuDrawer:close');
      this.$root.$emit('windowOverlay:show');
    },

    /**
     * Set closed state.
     */
    close() {
      this.isActive = false;
      this.$root.$emit('windowOverlay:hide');
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