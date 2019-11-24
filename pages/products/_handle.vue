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
  async asyncData({ app, params, store }) {
    const client = app.apolloProvider.defaultClient;

    const contentfulClient = await contentful.getEntries({
      'fields.productHandle': 'mens-wool-runners',
      content_type: 'product',
    });

    const product = await client.query({
      query: productByHandle,
      variables: { handle: params.handle },
    });
    
    const alternateProducts = await client.query({
      query: productsByTag,
      variables: { query: 'tag:alias_mens-wool-runners' },
    });

    return {
      product: product.data.productByHandle,
      alternates: alternateProducts.data.products.edges.map((item) => item.node),
      images: product.data.productByHandle.images.edges.map((item) => item.node),
      content: contentfulClient.items[0].fields.content,
    }
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
}
</script>