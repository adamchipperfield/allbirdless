<template>
  <div class="image-with-text">
    <div class="container">
      <div class="row flex">
        <div class="col xs12 m6">
          <img
            v-if="entry.fields.image"
            v-lazy="getImageUrl(entry.fields.image)"
            :alt="entry.fields.image.fields.title"
            class="image-with-text__image"
          >
        </div>

        <div class="col xs12 m6">
          <div class="image-with-text__body">
            <h3
              v-if="entry.fields.title"
              class="image-with-text__title"
            >
              {{ entry.fields.title }}
            </h3>

            <p
              v-if="entry.fields.content"
              class="image-with-text__content"
            >
              {{ entry.fields.content }}
            </p>

            <div v-if="entry.fields.button">
              <a
                v-if="entry.fields.button.fields.label"
                :href="entry.fields.button.fields.url"
                class="button button--outline"
              >
                {{ entry.fields.button.fields.label }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/components/content/image-with-text';
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