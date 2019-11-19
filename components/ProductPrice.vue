<template>
  <div class="product-price">
    {{ formatPrice(activePrice.amount) }}
    <span v-if="label">{{ label }}</span>
  </div>
</template>

<script>
export default {
  props: {
    currency: String,
    presentmentPrices: Object,
    label: String,
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('en-GB', { style: 'currency', currency: this.currency }).format(price);
    }
  },
  computed: {
    activePrice() {
      const prices = this.presentmentPrices.edges.map((item) => item.node.price);
      return prices.find((item) => item.currencyCode === this.currency);
    },
  },
}
</script>