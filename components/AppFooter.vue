<template>
  <div class="app-footer">
    <currency-selector />
    <language-selector />
  </div>
</template>

<script>
import currencySelector from './CurrencySelector';
import languageSelector from './LanguageSelector';

export default {
  components: {
    currencySelector,
    languageSelector,
  },
}
</script>