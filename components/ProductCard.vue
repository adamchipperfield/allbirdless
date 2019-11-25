<template>
  <div class="product-card">
    <nuxt-link
      class="product-card__thumbnail"
      :to="$getLocalePath(`/products/${product.handle}`)"
    >
      <img
        v-if="hasImages"
        :alt="[ product.images.edges[0].node.altText ? product.images.edges[0].node.altText : product.title ]"
        :src="product.images.edges[0].node.transformedSrc"
      >
    </nuxt-link>

    <nuxt-link
      v-if="color"
      class="product-card__title"
      :to="$getLocalePath(`/products/${product.handle}`)"
    >
      {{ color }}
    </nuxt-link>

    <product-price
      class="product-card__price"
      :presentmentPrices="product.presentmentPriceRanges"
      :currency="$store.state.checkout.currencyCode"
      :label="name"
    />
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/components/product-card';
</style>

<script>
import ProductPrice from './ProductPrice';

export default {
  props: {
    product: Object,
  },
  components: {
    ProductPrice,
  },
  computed: {
    hasImages() {
      return this.product.images.edges.length > 0;
    },
    hasVariants() {
      return this.product.variants.edges.length > 0;
    },
    name() {
      return this.product.title.split(' - ')[0];
    },
    color() {
      return this.product.title.split(' - ')[1];
    },
  },
}
</script>