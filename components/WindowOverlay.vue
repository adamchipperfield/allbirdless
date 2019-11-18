<template>
  <div
    class="window-overlay"
    :class="{ 'is-active': isActive }"
    @click="handleOverlayClick"
  >
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/components/window-overlay';
</style>

<script>
export default {
  data() {
    return {
      isActive: false,
    }
  },
  mounted() {
    this.$root.$on('windowOverlay:show', () => this.show());
    this.$root.$on('windowOverlay:hide', () => this.hide());
  },
  methods: {

    /**
     * Show the overlay.
     */
    show() {
      this.isActive = true;
    },

    /**
     * Hide the overlay.
     */
    hide() {
      this.isActive = false;
    },

    /**
     * Handles the overlay click.
     */
    handleOverlayClick() {
      this.$root.$emit('windowOverlay:click');
    },
  },
}
</script>