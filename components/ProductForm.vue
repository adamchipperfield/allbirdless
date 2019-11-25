<template>
  <div class="product-form">
    <h1>{{ name }}</h1>

    <product-price
      class="product-form__price"
      :presentmentPrices="variants[0].presentmentPrices"
      :currency="$store.state.checkout.currencyCode"
    />

    <div
      class="product-form__description"
      v-html="product.descriptionHtml"
    >
    </div>

    <div v-if="alternates.length > 0">
      <p class="product-form__label">
        {{ $t('product.form.selectOption').replace('#option#', 'Color') }}:
        <span class="product-form__label-value">{{ colorName }}</span>
      </p>

      <div class="swatch-grid">
        <div
          v-for="(alternate, index) in alternates"
          class="swatch-grid__item"
          :key="index"
        >
          <label
            class="swatch-grid__label"
            :style="`background-color: ${getProductColor(alternate)}`"
            @click="handleAlternateClick(alternate.id, $event)"
          >
            {{ alternate.handle }}
          </label>
        </div>
      </div>
    </div>

    <div v-if="variants.length > 1">
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
          <p class="product-form__label">
            {{ $t('product.form.selectOption').replace('#option#', option.name) }}:
            <span
              v-if="option.name !== 'Size'"
              class="product-form__label-value"
            >
              {{ getOptionValue(option) }}
            </span>
          </p>

          <div class="swatch-grid">
            <div
              class="swatch-grid__item"
              :class="[ option.name === 'Size' ? 'swatch-grid__item--text' : '' ]"
              v-for="(value, optionIndex) in option.values"
              :key="optionIndex"
            >
              <input
                ref="optionSelector"
                class="swatch-grid__radio"
                type="radio"
                :name="option.name"
                :id="`${index}-${optionIndex}`"
                :value="value"
                :data-index="index"
                :checked="optionIndex === 0"
                @change="handleOptionSelector"
              >

              <label
                class="swatch-grid__label"
                :style="[ option.name !== 'Size' ? `background-color: ${value.replace(' ', '').toLowerCase()}` : '' ]"
                :for="`${index}-${optionIndex}`"
              >
                {{ value }}
              </label>
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

    <div class="visually-hidden">
      <label for="Quantity">{{ $t('product.form.quantity') }}</label>
      <input
        id="Quantity"
        ref="quantityInput"
        name="quantity"
        type="number"
        value="1"
      >
    </div>
  
    <button
      ref="addToCart"
      class="button button--block"
      name="addToCart"
      type="button"
      :disabled="activeVariant.available === false"
      @click="addVariantToCart"
    >
      {{ activeVariant.available ? $t('product.form.addToCart') : $t('product.form.outOfStock') }}
    </button>
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/components/product-form';
</style>

<script>
import ProductPrice from '../components/ProductPrice';

export default {
  props: {
    alternates: Array,
    product: Object,
  },
  data() {
    return {
      activeVariant: {},
      options: {},
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
          this.$root.$emit('cartDrawer:toggle');
        });
    },

    /**
     * Handles the option selector event.
     */
    handleOptionSelector() {
      this.$refs.optionSelector.forEach((selector) => {
        if (selector.type === 'radio') {
          if (selector.checked) {
            this.options[selector.name] = selector.value;
          }
        } else {
          this.options[selector.name] = selector.value;
        }
      });

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

    /**
     * Gets the value for a specified option.
     * @param {object} option - The option object.
     */
    getOptionValue(option) {
      return this.options[option.name] ? this.options[option.name] : option.values[0];
    },

    /**
     * Handles the alternate swatch click event.
     * @param {string} ID - The alternate product ID.
     * @param {object} event - The event object.
     */
    handleAlternateClick(ID, event) {
      event.preventDefault();
      this.$emit('product:changed', this.alternates.find((item) => item.id === ID));
    },

    /**
     * Returns a product's colour.
     */
    getProductColor(product) {
      const found = product.tags.find((tag) => tag.indexOf('color_') !== -1);
      return found ? found.split('color_')[1] : '';
    },
  },
  computed: {
    variants() {
      return this.product.variants.edges.map((variant) => variant.node);
    },
    name() {
      return this.product.title.split(' - ')[0];
    },
    colorName() {
      return this.product.title.split(' - ')[1];
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