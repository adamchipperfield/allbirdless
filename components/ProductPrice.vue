<template>
  <div class="product-price">
    {{ formatPrice(activePrice.price.amount) }}
  </div>
</template>

<script>
export default {
  props: {
    currency: String,
    presentmentPrices: Object,
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('en-GB', { style: 'currency', currency: this.currency }).format(price);
    }
  },
  computed: {
    activePrice() {
      const prices = this.presentmentPrices.edges.map((item) => item.node);
      return prices.find((item) => item.price.currencyCode === this.currency);
    },
  },
}
</script>