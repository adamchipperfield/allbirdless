<template>
  <div class="template-error">
    <h1 class="template-error__title">{{ $t('error.title') }}</h1>
    <p class="template-error__subtitle">{{ $t('error.subtitle') }}</p>

    <nuxt-link
      class="template-error__link"
      :to="$getLocalePath('/')"
    >
      {{ $t('error.link_label') }}
    </nuxt-link>
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/layouts/error';
</style>

<script>
export default {
  props: [
    'error',
  ],
}
</script>