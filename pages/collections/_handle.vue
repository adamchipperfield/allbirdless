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

    <div class="template-collection__grid">
      <div class="container">
        <div class="row">
          <product-card
            v-for="(product, index) in products"
            :key="index"
            :product="product"
            class="col xs6 m3"
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