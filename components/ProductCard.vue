<template>
  <div class="product-card">
    <nuxt-link :to="`/products/${product.handle}`">{{ product.title }}</nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    product: Object,
  },
}
</script>