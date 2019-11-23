<template>
  <div class="template-access">
    <div class="template-access__container">
      <div class="row">
        <div class="col xs12 m6">
          <form
            class="template-access__login form"
            @submit="handleLoginSubmit"
          >
            <h2 class="form__title">{{ $t('account.login.title') }}</h2>

            <label for="Email">{{ $t('account.login.email') }}</label>
            <input
              ref="emailInput"
              id="Email"
              type="email"
              :autofocus="isLogin"
            >

            <label for="Password">{{ $t('account.login.password') }}</label>
            <input
              ref="passwordInput"
              id="Password"
              type="password"
            >

            <button
              class="button button--block"
              type="submit"
            >
              {{ $t('account.login.login') }}
            </button>
          </form>
        </div>
        <div class="col xs12 m6">
          <form
            class="template-access__register form"
            @submit="handleRegisterSubmit"
          >
            <h2 class="form__title">{{ $t('account.register.title') }}</h2>

            <p class="form__description">{{ $t('account.register.line_1') }}</p>
            <p class="form__description">{{ $t('account.register.line_2') }}</p>

            <label for="Email">{{ $t('account.register.email') }}</label>
            <input
              ref="emailInput"
              id="Email"
              type="email"
              :autofocus="isRegister"
            >

            <label for="Password">{{ $t('account.register.password') }}</label>
            <input
              ref="passwordInput"
              id="Password"
              type="password"
            >

            <button
              class="button button--block"
              type="submit"
            >
              {{ $t('account.register.createAccount') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/pages/account/access';
</style>

<script>
export default {
  methods: {
    handleLoginSubmit(event) {
      event.preventDefault();
      
      this.$store.dispatch('loginCustomer', {
        email: this.$refs.emailInput.value,
        password: this.$refs.passwordInput.value,
      });
    },
    handleRegisterSubmit(event) {
      event.preventDefault();
      
      this.$store.dispatch('createCustomer', {
        email: this.$refs.emailInput.value,
        password: this.$refs.passwordInput.value,
      });
    },
  },
  computed: {
    isLogin() {
      return this.$router.currentRoute.name === 'login';
    },
    isRegister() {
      return this.$router.currentRoute.name === 'register';
    },
  },
}
</script>