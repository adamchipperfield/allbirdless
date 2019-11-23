<template>
  <div class="quantity-selector">
    <input
      ref="quantityInput"
      min="0"
      type="hidden"
      :value="quantity"
    >

    <button
      class="quantity-selector__button"
      @click="decreaseQuantity()"
    >
      -
    </button>

    <span class="quantity-selector__label">
      {{ quantity }}
    </span>

    <button
      class="quantity-selector__button"
      @click="increaseQuantity()"
    >
      +
    </button>
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/components/quantity-selector';
</style>

<script>
export default {
  data() {
    return {
      quantity: this.defaultQuantity,
    }
  },
  props: {
    defaultQuantity: {
      type: Number,
      default: 1,
    },
  },
  methods: {

    /**
     * Increases the quantity.
     */
    increaseQuantity() {
      this.quantity++;
      this.$emit('quantityChanged', this.quantity);
    },

    /**
     * Decreases the quantity.
     */
    decreaseQuantity() {
      if (this.quantity === 0) {
        return;
      }

      if (this.quantity === 1) {
        this.$emit('removeItem');
      }

      this.quantity--;
      this.$emit('quantityChanged', this.quantity);
    },
  },
  watch: {
    defaultQuantity: {
      handler(value) {
        this.quantity = value;
      },
    },
  },
}
</script>