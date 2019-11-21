<template>
  <div
    v-if="entry.fields.image"
    class="wide-image"
    :style="`
      background-image: url('${getImageUrl(entry.fields.image)}');
    `"
  >
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/components/content/wide-image';
</style>

<script>
export default {
  props: {
    entry: Object,
  },
  methods: {
    getImageUrl(image) {
      return image.fields.file.url;
    },
  },
}
</script>