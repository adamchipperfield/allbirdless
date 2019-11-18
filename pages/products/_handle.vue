<template>
  <div class="template-product">
    <product-form :product="product" />

    <div v-html="product.descriptionHtml"></div>
  </div>
</template>

<script>
import productByHandle from '../../graphql/queries/productByHandle';
import ProductForm from '../../components/ProductForm';

export default {
  components: {
    ProductForm,
  },
  async asyncData({ app, params, store }) {
    const client = app.apolloProvider.defaultClient;

    const product = await client.query({
      query: productByHandle,
      variables: { handle: params.handle },
    });

    return {
      product: product.data.productByHandle,
    }
  },
}
</script>