<template>
  <div class="product-card">
    <nuxt-link
      class="product-card__thumbnail"
      :to="`/products/${product.handle}`"
    >
      <img
        v-if="hasImages"
        :alt="[ product.images.edges[0].node.altText ? product.images.edges[0].node.altText : product.title ]"
        :src="product.images.edges[0].node.originalSrc"
      >
    </nuxt-link>

    <nuxt-link
      v-if="colorName"
      class="product-card__title"
      :to="`/products/${product.handle}`"
    >
      {{ colorName }}
    </nuxt-link>

    <product-price
      class="product-card__price"
      :presentmentPrices="product.presentmentPriceRanges"
      :currency="$store.state.checkout.currencyCode"
      :label="product.title"
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
    colorName() {
      const tag = this.product.tags.find((tag) => tag.includes('color_'));

      if (tag) {
        return tag.replace('color_', '');
      }
    },
  },
}
</script>