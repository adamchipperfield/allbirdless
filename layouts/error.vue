<template>
  <div class="template-error">
    <h1>Something went wrong...</h1>
    <nuxt-link :to="$getLocalePath('/')">Go home</nuxt-link>
  </div>
</template>

<script>
export default {
  props: [
    'error',
  ],
}
</script>