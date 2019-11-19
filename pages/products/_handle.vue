<template>
  <div class="template-product">
    <div class="row">
      <div class="col xs12 m6">
        <product-gallery :images="images" />
      </div>

      <div class="col xs12 m6">
        <product-form :product="product" />
      </div>
    </div>
  </div>
</template>

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