<template>
  <div class="product-form">
    <h1>{{ product.title }}</h1>

    <product-price
      :presentmentPrices="variants[0].presentmentPrices"
      :currency="$store.state.checkout.currencyCode"
    />

    <div v-if="product.options.length > 1">
      <div
        v-for="(option, index) in product.options"
        :key="index"
      >
        <select
          ref="optionSelector"
          v-if="!optionIsSwatch(option)"
          :name="option.name"
          :data-index="index"
          @change="handleOptionSelector"
        >
          <option disabled>{{ option.name }}</option>
          <option
            v-for="(value, optionIndex) in option.values"
            :key="optionIndex"
            :value="value"
          >
            {{ value }}
          </option>
        </select>

        <div v-if="optionIsSwatch(option)">
          <div class="swatch-grid">
            <div
              class="swatch-grid__item"
              v-for="(value, optionIndex) in option.values"
              :key="optionIndex"
            >
              <label
                class="swatch-grid__label"
                :for="index"
              >
                {{ value }}
              </label>

              <input
                ref="optionSelector"
                class="swatch-grid__radio"
                type="radio"
                :name="option.name"
                :id="index"
                :value="value"
                :data-index="index"
                :checked="optionIndex === 0"
                @change="handleOptionSelector"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="visually-hidden">
      <label for="VariantSelector">{{ $t('product.form.variant') }}</label>
      <select
        id="VariantSelector"
        ref="variantSelector"
        name="variant"
      >
        <option
          v-for="(variant, index) in variants"
          :key="index"
          :value="variant.id"
          :disabled="!variant.available"
        >
          {{ variant.title }}
        </option>
      </select>
    </div>

    <label for="Quantity">{{ $t('product.form.quantity') }}</label>
    <input
      id="Quantity"
      ref="quantityInput"
      name="quantity"
      type="number"
      value="1"
    >
  
    <button
      ref="addToCart"
      name="addToCart"
      type="button"
      :disabled="activeVariant.available === false"
      @click="addVariantToCart"
    >
      {{ activeVariant.available ? $t('product.form.addToCart') : $t('product.form.outOfStock') }}
    </button>
  </div>
</template>

<script>
import ProductPrice from '../components/ProductPrice';

export default {
  props: {
    product: Object,
  },
  data() {
    return {
      activeVariant: {},
    }
  },
  components: {
    ProductPrice,
  },
  methods: {
    /**
     * Adds the active variant to cart.
     */
    addVariantToCart() {
      this.$refs.addToCart.textContent = this.$t('product.form.addingToCart');

      this.$store.dispatch('addVariantToCart', {
        variantId: this.$refs.variantSelector.value,
        quantity: this.$refs.quantityInput.value,
      })
        .then(() => {
          this.$refs.addToCart.textContent = this.$t('product.form.addToCart');
        });
    },

    /**
     * Handles the option selector event.
     */
    handleOptionSelector() {
      this.activeVariant = this.getSelectedVariant();
      this.$refs.variantSelector.value = this.getSelectedVariant().id;
      this.$refs.quantityInput.value = 1;
    },

    /**
     * Returns the selected options.
     */
    getSelectedOptions() {
      const selectedOptions = [];

      this.$refs.optionSelector.forEach(selector => {
        const type = selector.type;
        const selectedOption = {};

        if (selector.type === 'radio') {
          if (selector.checked) {
            selectedOption.index = Number(selector.dataset.index);
            selectedOption.value = selector.value;

            selectedOptions.push(selectedOption);
          }
        } else {
          selectedOption.index = Number(selector.dataset.index);
          selectedOption.value = selector.value;

          selectedOptions.push(selectedOption);
        }
      });

      return selectedOptions;
    },

    /**
     * Returns the selected variant object.
     */
    getSelectedVariant() {
      const selectedOptions = this.getSelectedOptions();
      let found = false;

      this.variants.forEach(variant => {
        let satisfied = true;

        selectedOptions.forEach(option => {
          if (satisfied) {
            const optionValue = variant.selectedOptions[option.index].value;
            satisfied = optionValue === option.value;
          }
        });

        if (satisfied) {
          found = variant;
        }
      });

      return found;
    },

    /**
     * Returns if the option is a swatch.
     * @param {object} option - The option object.
     */
    optionIsSwatch(option) {
      const types = ['color', 'colour', 'size'];
      const name = option.name.toLowerCase();

      return types.includes(name);
    },
  },
  computed: {
    variants() {
      return this.product.variants.edges.map((variant) => variant.node);
    },
  },
  beforeMount() {

    /**
     * Sets the default active variant.
     */
    this.activeVariant = this.variants[0];
  },
}
</script>