import fetch from 'node-fetch';
import dotenv from 'dotenv';

/**
 * Import the locale files.
 */
import enGB from './locales/en-GB';
import frFR from './locales/fr-FR';

/**
 * Config dotenv.
 */
dotenv.config();

/**
 * Instance globals.
 */
const storeUrl = `https://${process.env.SHOPIFY_STORE}`;
const storeAccess = process.env.SHOPIFY_ACCESS;

/**
 * Nuxt.js configuration.
 */
export default {
  head: {
    title: 'Frameless',
    meta: [
      { name: 'description', content: 'Headless Shopify implementation.' },
    ],
    link: [
      { rel: 'preconnect', href: storeUrl },
    ],
  },
  styleResources: {
    scss: [
      '@/assets/styles/config/grid.scss',
      '@/assets/styles/config/mixins.scss',
      '@/assets/styles/config/fonts.scss',
    ],
  },
  modules: [
    '@nuxtjs/apollo',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    'cookie-universal-nuxt',
    [
      'nuxt-i18n',
      {
        locales: ['en', 'fr'],
        defaultLocale: 'en',
        strategy: 'no_prefix',
        vueI18n: {
          fallbackLocale: 'en',
          messages: {
            en: enGB,
            fr: frFR,
          },
        },
        vuex: {
          syncLocale: true,
        },
      },
    ],
  ],
  plugins: [
    {
      src: '~/plugins/vuex-persistedstate.js',
      ssr: false,
    },
  ],
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: `${storeUrl}/api/2019-10/graphql.json`,
        httpLinkOptions: {
          headers: {
            'X-Shopify-Storefront-Access-Token': storeAccess,
          },
        },
      },
    },
  },
  generate: {
    dir: 'dist',
    fallback: true,
    minify: {
      collapseWhitespace: false,
    },
    routes() {
      return fetch(`${storeUrl}/api/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/graphql',
          'X-Shopify-Storefront-Access-Token': storeAccess,
        },
        body: `
          query allProducts {
            products(first: 100) {
              edges {
                node {
                  handle
                }
              }
            }
            collections(first: 100) {
              edges {
                node {
                  handle
                }
              }
            }
          }
        `,
      })
        .then((response) => response.json())
        .then((response) => {
          const products = response.data.products.edges.map((item) => `/products/${item.node.handle}`);
          const collections = response.data.collections.edges.map((item) => `/collections/${item.node.handle}`);

          return [].concat.apply([], [products, collections]);
        })
        .catch((error) => error);
    },
  },
}