<template>
  <div class="template-collection">
    <header class="template-collection__header">
      <div
        class="template-collection__image"
        v-lazy:background-image="collection.image.originalSrc"
      >
      </div>

      <div class="template-collection__intro">
        <h1 class="template-collection__title">{{ collection.title }}</h1>

        <div
          v-if="collection.descriptionHtml"
          v-html="collection.descriptionHtml"
          class="template-collection__description"
        >
        </div>
      </div>
    </header>

    <div class="container">
      <div class="row">
        <div class="col xs12">
          <div class="template-collection__toolbar">
            <div class="template-collection__filter">
              <button
                class="template-collection__filter-clear button button--small button--secondary"
                v-if="activeFilters.length"
                @click="clearActiveFilters"
              >
                {{ $t('collection.filter.clear') }}
              </button>

              <div
                v-for="(filter, index) in filters"
                :key="index"
              >
                <div v-if="filter.options.length">
                  <label
                    class="visually-hidden"
                    :for="`Filter-${filter.name}`"
                  >
                    {{ filter.label[$i18n.locale] }}
                  </label>

                  <select
                    ref="filterSelector"
                    class="template-collection__filter-selector"
                    :id="`Filter-${filter.name}`"
                    @change="handleFilterChange($event)"
                  >
                    <option selected disabled>{{ filter.label[$i18n.locale] }}</option>
                    <option
                      v-for="(option, optionIndex) in filter.options"
                      :key="optionIndex"
                      :name="option"
                      :value="`${filter.name}_${option}`"
                    >
                      {{ option }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="template-collection__grid">
      <div class="container">
        <div class="row">
          <product-card
            v-for="(product, index) in productList"
            :key="index"
            :product="product"
            class="col xs6 m4 l3"
          >
          </product-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/pages/collection';
</style>

<script>
import collectionByHandle from '../../graphql/queries/collectionByHandle';
import ProductCard from '../../components/ProductCard';

export default {
  data() {
    return {
      activeFilters: [],
      productList: [],
      filters: [
        {
          name: 'color',
          label: {
            'en-GB': 'Color',
            fr: 'Couleur',
          },
          options: [
            'Maroon',
            'Teal',
            'Black',
            'White',
            'Grey',
          ],
        },
        {
          name: 'size',
          label: {
            'en-GB': 'Size',
            fr: 'Taille',
          },
          options: [
            'S',
            'L',
            'XL',
            'XXL',
          ],
        },
      ],
    }
  },
  components: {
    ProductCard,
  },
  async asyncData({app, params, error}) {
    const client = app.apolloProvider.defaultClient;
    const data = {};

    await client.query({
      query: collectionByHandle,
      variables: { handle: params.handle },
    })
      .then((response) => {
        if (!response.data.collectionByHandle) {
          return error({ statusCode: 404 });
        }

        data.collection = response.data.collectionByHandle;
        data.products = response.data.collectionByHandle.products.edges.map((product) => product.node);
      });

    return data;
  },
  created() {
    this.productList = this.products;
  },
  methods: {

    /**
     * Returns if a filter group exists.
     * @param {string} name - The name.
     */
    hasFilterGroup(name) {
      return this.filters.find((filter) => filter.name === name) ? true : false;
    },

    /**
     * Filters the products by a tag.
     * @param {object} event - The event.
     */
    handleFilterChange(event) {
      this.activeFilters = [];
 
      this.$refs.filterSelector.forEach((selector) => {
        if (selector[selector.selectedIndex].disabled) {
          return;
        }

        if (this.activeFilters.indexOf(selector.value) === -1) {
          this.activeFilters.push(selector.value);
        }
      });

      this.productList = this.products.filter((product) => {
        return this.activeFilters.every((filter) => product.tags.includes(filter));
      });
    },

    /**
     * Clears the active filters
     */
    clearActiveFilters() {
      this.activeFilters = [];
      this.productList = this.products;
      this.$refs.filterSelector.forEach((selector) => selector.selectedIndex = 0);
    },
  },
  head() {
    return {
      title: this.collection.title,
    }
  },
}
</script>