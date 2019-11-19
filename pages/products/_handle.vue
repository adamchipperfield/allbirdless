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
      />
    </div>
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/pages/product';
</style>

<script>
import productByHandle from '../../graphql/queries/productByHandle';
import ProductForm from '../../components/ProductForm';
import ProductGallery from '../../components/ProductGallery';

export default {
  components: {
    ProductForm,
    ProductGallery,
  },
  async asyncData({ app, params, store }) {
    const client = app.apolloProvider.defaultClient;

    const product = await client.query({
      query: productByHandle,
      variables: { handle: params.handle },
    });

    return {
      product: product.data.productByHandle,
      images: product.data.productByHandle.images.edges.map((item) => item.node),
    }
  },
}
</script>