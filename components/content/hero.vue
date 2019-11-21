<template>
  <div
    class="hero"
    :style="`
      background-image: url('${getImageUrl(this.entry.fields.image)}');
    `"
  >
    <div class="hero__content">
      <h2
        v-if="entry.fields.title"
        v-html="entry.fields.title"
        class="hero__title"
      >
      </h2>

      <h3
        v-if="entry.fields.subtitle"
        class="hero__subtitle"
      >
        {{ entry.fields.subtitle }}
      </h3>
    </div>

    <div class="hero__button-group">
      <a
        v-for="(button, index) in buttons"
        class="hero__button"
        :key="index"
        :href="button.fields.url"
      >
        <span class="hero__button-label">{{ button.fields.label }}</span>
      </a>
    </div>
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/components/content/hero';
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
  computed: {
    buttons() {
      return this.entry.fields.button;
    },
  },
}
</script>