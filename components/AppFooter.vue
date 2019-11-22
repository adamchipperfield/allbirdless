<template>
  <div class="app-footer">
    <div class="container">
      <div class="row">
        <div
          v-for="(menu, index) in $store.state.footer.menus"
          class="col xs12 s6 m4 l3"
          :key="index"
        >
          <ul class="app-footer__menu">
            <li class="app-footer__menu-title">{{ menu.fields.title }}</li>
            <li
              v-for="(menuItem, menuItemIndex) in menu.fields.menuItem"
              class="app-footer__menu-item"
              :key="menuItemIndex"
            >
              <a :href="menuItem.fields.url">{{ menuItem.fields.label }}</a>
            </li>
          </ul>
        </div>

        <div class="col xs12">
          <p class="app-footer__copy">&copy; 2019 Allbirds, Inc. All Rights Reserved. Terms, Privacy and Cookies &amp; Accessibility</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/components/app-footer';
</style>
