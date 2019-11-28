<template>
  <div class="product-gallery">
    <img
      v-for="(image, index) in images"
      v-lazy="image.transformedSrc"
      :key="index"
      :alt="image.altText"
    >
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/components/product-gallery';
</style>

<script>
export default {
  props: {
    images: Array,
  },
}
</script>