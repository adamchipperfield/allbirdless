<template>
  <div class="template-collection">
    <header class="template-collection__header">
      <div
        class="template-collection__image"
        :style="`background-image: url('${collection.image.originalSrc}')`"
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

    <div class="template-collection__toolbar">
      <div class="container">
        <div class="row">
          <div class="col xs12 m6"></div>
          <div class="col xs12 m6">
            <div class="template-collection__filter">
              <div
                v-for="(filter, index) in filters"
                :key="index"
              >
                <div v-if="filter.options.length">
                  <label :for="`Filter-${filter.name}`">{{ filter.label[$i18n.locale] }}</label>

                  <select
                    ref="filterSelector"
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
            'Navy',
            'Green',
            'White',
            'Black',
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
  async asyncData({app, params}) {
    const client = app.apolloProvider.defaultClient;

    const collection = await client.query({
      query: collectionByHandle,
      variables: { handle: params.handle },
    });

    return {
      collection: collection.data.collectionByHandle,
      products: collection.data.collectionByHandle.products.edges.map((product) => product.node),
    }
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
      this.$refs.filterSelector.forEach((selector) => {
        if (selector[selector.selectedIndex].disabled) {
          return;
        }

        this.activeFilters.push(selector.value);
      });

      this.productList = this.products.filter((product) => {
        return this.activeFilters.every((filter) => product.tags.includes(filter));
      });
    },
  },
}
</script>