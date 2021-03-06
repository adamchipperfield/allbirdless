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
const oneSignalId = process.env.ONESIGNAL_ID;

/**
 * Nuxt.js configuration.
 */
export default {
  head: {
    title: 'Allbirds',
    meta: [
      { name: 'description', content: 'The world’s most comfortable shoes made from premium natural materials go perfectly with your everyday escapades.' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    ],
    link: [
      { rel: 'preconnect', href: storeUrl },
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
    ],
  },
  styleResources: {
    scss: [
      '@/assets/styles/config/grid.scss',
      '@/assets/styles/config/mixins.scss',
      '@/assets/styles/config/fonts.scss',
      '@/assets/styles/config/colors.scss',
      '@/assets/styles/config/typography.scss',
      '@/assets/styles/helpers/animations.scss',
    ],
  },
  loading: '~/components/LoadingScreen.vue',
  modules: [
    '@nuxtjs/apollo',
    '@nuxtjs/onesignal',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    'cookie-universal-nuxt',
    [
      'nuxt-i18n',
      {
        locales: ['en-GB', 'fr'],
        defaultLocale: 'en-GB',
        vueI18n: {
          fallbackLocale: 'en-GB',
          messages: {
            "en-GB": enGB,
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
    { src: '~/plugins/vuex-persistedstate.js', ssr: false },
    { src: '~/plugins/get-locale-path.js' },
    { src: '~/plugins/vue-lazyload.js' },
  ],
  oneSignal: {
    init: {
      appId: oneSignalId,
      allowLocalhostAsSecureOrigin: true,
    },
  },
  pwa: {
    meta: {
      name: 'Allbirds',
      description: 'The world’s most comfortable shoes made from premium natural materials go perfectly with your everyday escapades.',
    },
    manifest: {
      name: 'Allbirds',
      short_name: 'Allbirds',
      background_color: 'rgb(255, 255, 255)',
      theme_color: 'rgb(255, 255, 255)',
      icons: [
        {
          src: '~/static/icon.png',
          type: 'image/png',
        },
      ],
    },
  },
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
  router: {
    extendRoutes(routes, resolve) {
      routes.push(
        {
          name: 'login',
          path: '/account/login',
          component: resolve(__dirname, 'pages/account/access.vue')
        },
        {
          name: 'register',
          path: '/account/register',
          component: resolve(__dirname, 'pages/account/access.vue')
        },
      );
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
  render: {
    bundleRenderer: {
      shouldPreload: (type) => {
        return ['script', 'style', 'font'].includes(type);
      },
    },
  },
}