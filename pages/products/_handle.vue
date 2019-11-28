<template>
  <div class="template-product">
    <div class="template-product__container">
      <product-gallery
        class="template-product__gallery"
        :images="images"
      />

      <product-form
        class="template-product__form"
        :product="product"
        :alternates="alternates"
        @product:changed="updateProductObject"
      />
    </div>

    <component
      v-for="(section, index) in getSections"
      :key="index"
      :is="section.component"
      :entry="section.entry"
    >
    </component>
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/pages/product';
</style>

<script>
import contentful from '~/plugins/contentful';

import productByHandle from '../../graphql/queries/productByHandle';
import productsByTag from '../../graphql/queries/productsByTag';

import ProductForm from '../../components/ProductForm';
import ProductGallery from '../../components/ProductGallery';

export default {
  components: {
    ProductForm,
    ProductGallery,
  },
  async asyncData({ app, params, store, error }) {
    const client = app.apolloProvider.defaultClient;
    const data = {};

    await client.query({
      query: productByHandle,
      variables: { handle: params.handle },
    })
      .then((response) => {
        const product = response.data.productByHandle;

        if (!response.data.productByHandle) {
          return error({ statusCode: 404 });
        }

        data.product = product;
        data.images = product.images.edges.map((item) => item.node);
      });

    await contentful.getEntries({
      'fields.productHandle': 'mens-wool-runners',
      content_type: 'product',
    })
      .then((response) => {
        if (response) {
          data.content = response.items[0].fields.content;
        }
      });
    
    await client.query({
      query: productsByTag,
      variables: { query: 'tag:alias_mens-wool-runners' },
    })
      .then((response) => {
        const products = response.data.products;

        if (products) {
          data.alternates = products.edges.map((item) => item.node);
        }
      });

    return data;
  },
  methods: {
    updateProductObject(data) {
      this.product = data;
      this.images = data.images.edges.map((item) => item.node);
      history.pushState({}, '', this.$getLocalePath(`/products/${data.handle}`));
    },
  },
  computed: {
    getSections() {
      const sections = [];

      this.content.forEach((entry) => {
        const entryId = entry.sys.contentType.sys.id;
        const componentName = entryId.charAt(0).toUpperCase() + entryId.slice(1);

        sections.push({
          component: async () => await import(`@/components/content/${componentName}.vue`),
          entry,
        });
      });

      return sections;
    },
  },
  head() {
    return {
      title: this.product.title,
    }
  },
}
</script>