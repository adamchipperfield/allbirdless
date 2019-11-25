<template>
  <div class="app-logo">
    <nuxt-link :to="$getLocalePath('/')">
      <img
        :alt="$store.app.head.title"
        height="38"
        src="~/assets/images/allbirds-logo.svg"
      >
    </nuxt-link>
  </div>
</template>