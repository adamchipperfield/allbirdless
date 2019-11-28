<template>
  <div
    class="loading-screen"
    :class="{ 'is-loading': loading }"
  >
    <img class="loading-screen__icon" src="~/static/loading.svg">
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/components/loading-screen';
</style>

<script>
export default {
  data: () => ({
    loading: false,
  }),
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      setTimeout(() => {
        this.loading = false;
      }, 750);
    },
  },
}
</script>