<template>
  <div class="currency-selector">
    <label for="CurrencySelector">{{ $t('currencySelector.label') }}</label>
    <select
      id="CurrencySelector"
      ref="currencySelector"
      :model="$i18n.locale"
    >
      <option
        v-for="(currency, index) in enabledCurrencies"
        :key="index"
        :value="currency"
        :selected="$store.state.checkout.currencyCode === currency"
      >
        {{ currency }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  methods: {
    handleCurrencyChange() {
      this.$store.dispatch('updateActiveCurrency', this.$refs.currencySelector.value);
    },
  },
  computed: {
    enabledCurrencies() {
      return this.$store.state.shop.paymentSettings.enabledCurrencies;
    },
  },
}
</script>