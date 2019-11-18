<template>
  <div class="language-selector">
    <label for="LanguageSelector">{{ $t('languageSelector.label') }}</label>
    <select
      id="LanguageSelector"
      ref="languageSelector"
      @change="handleLanguageChange"
    >
      <option
        v-for="(locale, index) in availableLocales"
        :key="index"
        :value="locale"
        :selected="activeLocale === locale"
      >
        {{ locale.toUpperCase() }}
      </option>  
    </select>
  </div>
</template>

<script>
export default {
  methods: {

    /**
     * Handles the language change event.
     */
    handleLanguageChange() {
      this.$i18n.setLocale(this.$refs.languageSelector.value);
    },
  },
  computed: {
    availableLocales() {
      return this.$i18n.locales;
    },
    activeLocale() {
      return this.$i18n.locale;
    },
  },
}
</script>