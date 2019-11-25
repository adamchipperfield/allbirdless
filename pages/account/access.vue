<template>
  <div class="template-access">
    <div class="template-access__container container">
      <div class="row">
        <div class="col xs12 m6">
          <form
            v-show="!isResettingPassword"
            class="template-access__login form"
            @submit="handleLoginSubmit"
          >
            <h2 class="form__title">{{ $t('account.login.title') }}</h2>

            <label for="EmailLogin">{{ $t('account.login.email') }}</label>
            <input
              ref="emailInputLogin"
              id="EmailLogin"
              type="email"
              :autofocus="isLogin"
            >

            <label for="PasswordLogin">{{ $t('account.login.password') }}</label>
            <input
              ref="passwordInputLogin"
              id="PasswordLogin"
              type="password"
            >

            <button
              class="button button--block"
              type="submit"
            >
              {{ $t('account.login.login') }}
            </button>

            <button
              class="template-access__reset-toggle text-link"
              type="button"
              @click="togglePasswordReset($event)"
            >
              {{ $t('account.login.reset_password') }}
            </button>
          </form>

          <form
            v-show="isResettingPassword"
            class="template-access__login form"
            @submit="handlePasswordResetSubmit"
          >
            <h2 class="form__title">{{ $t('account.login.reset_password') }}</h2>

            <label for="EmailPasswordReset">{{ $t('account.login.email') }}</label>
            <input
              ref="emailInputPasswordReset"
              id="EmailPasswordReset"
              type="email"
            >

            <button
              class="button button--block"
              type="submit"
            >
              {{ $t('account.login.submit_reset_password') }}
            </button>

            <button
              class="template-access__reset-toggle text-link"
              type="button"
              @click="togglePasswordReset($event)"
            >
              {{ $t('account.login.close_reset_password') }}
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

            <label for="EmailRegister">{{ $t('account.register.email') }}</label>
            <input
              ref="emailInputRegister"
              id="EmailRegister"
              type="email"
              :autofocus="isRegister"
            >

            <label for="PasswordRegister">{{ $t('account.register.password') }}</label>
            <input
              ref="passwordInputRegister"
              id="PasswordRegister"
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
  data() {
    return {
      isResettingPassword: false,
    }
  },
  methods: {

    /**
     * Handles the login submit event.
     * @param {object} event - The event.
     */
    handleLoginSubmit(event) {
      event.preventDefault();
      
      this.$store.dispatch('loginCustomer', {
        email: this.$refs.emailInputLogin.value,
        password: this.$refs.passwordInputLogin.value,
      });
    },

    /**
     * Handles the register submit event.
     * @param {object} event - The event.
     */
    handleRegisterSubmit(event) {
      event.preventDefault();
      
      this.$store.dispatch('createCustomer', {
        email: this.$refs.emailInputRegister.value,
        password: this.$refs.passwordInputRegister.value,
      });
    },

    /**
     * Toggles the password reset form.
     * @param {object} event - The event.
     */
    togglePasswordReset(event) {
      event.preventDefault();
      this.isResettingPassword = this.isResettingPassword ? false : true;
    },

    /**
     * Handles the password reset submit event.
     * @param {object} event - The event.
     */
    handlePasswordResetSubmit(event) {
      const input = this.$refs.emailInputPasswordReset;
      event.preventDefault();

      input.textContent = this.$t('account.login.resetting_password');

      this.$store.dispatch('submitPasswordReset', input.value)
        .then(({ data }) => {
          if (data.customerRecover.userErrors.length === 0) {
            input.textContent = this.$t('account.login.sent_reset_password');
            event.target.reset();
          }
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
  mounted() {
    this.$root.$on('login:failed', () => {
      console.error('Login failed.');
    });
  },
}
</script>