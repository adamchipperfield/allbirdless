<template>
  <div
    class="menu-drawer"
    :class="{ 'is-active': isActive }"
  >
    <ul class="menu-drawer__nav">
      <li
        v-for="(item, index) in menuItems"
        :key="index"
        class="menu-drawer__item"
      >
        <nuxt-link
          :to="item.url"
          class="menu-drawer__link menu-drawer__link--primary"
        >
          {{ item.title }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/components/menu-drawer';
</style>

<script>
export default {
  data() {
    return {
      isActive: false,
      menuItems: [
        {
          title: 'Men',
          url: '/collections/mens',
        },
        {
          title: 'Women',
          url: '/collections/womens',
        },
      ],
    }
  },
  mounted() {
    this.$root.$on('menuDrawer:toggle', () => this.toggle());
    this.$root.$on('menuDrawer:close', () => this.close());
  },
  methods: {

    /**
     * Handles the toggle event.
     */
    toggle() {
      return this.isActive ? this.close() : this.open()
    },

    /**
     * Set active state.
     */
    open() {
      this.isActive = true;
      this.$root.$emit('menuDrawer:opened');
    },

    /**
     * Set closed state.
     */
    close() {
      this.isActive = false;
      this.$root.$emit('menuDrawer:closed');
    },
  },
}
</script>