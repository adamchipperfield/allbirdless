export default ({ app }, inject) => {
  inject('getLocalePath', (path) => {
    return app.i18n.locale === app.i18n.defaultLocale ? path : `/${app.i18n.locale}${path}`;
  });
}