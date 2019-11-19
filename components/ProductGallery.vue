<template>
  <div class="product-gallery">
    <img
      v-for="(image, index) in images"
      :key="index"
      :alt="image.altText"
      :src="image.transformedSrc"
    >
  </div>
</template>

<script>
export default {
  props: {
    images: Object,
  },
}
</script>