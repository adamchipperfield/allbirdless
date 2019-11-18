<template>
  <div class="template-collection">
    <h1>{{ collection.title }}</h1>

    <product-card
      v-for="(product, index) in products"
      :key="index"
      :product="product"
    >
    </product-card>
  </div>
</template>

<script>
import collectionByHandle from '../../graphql/queries/collectionByHandle';
import ProductCard from '../../components/ProductCard';

export default {
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
}
</script>