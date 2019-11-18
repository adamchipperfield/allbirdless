<template>
  <div class="template-register">
    <form @submit="handleRegisterSubmit">
      <label for="Email">{{ $t('account.register.email') }}</label>
      <input
        ref="emailInput"
        id="Email"
        type="email"
        placeholder="Email Address"
      >

      <label for="Password">{{ $t('account.register.password') }}</label>
      <input
        ref="passwordInput"
        id="Password"
        type="password"
        placeholder="Password"
      >

      <button type="submit">{{ $t('account.register.createAccount') }}</button>
    </form>
  </div>
</template>

<script>
export default {
  methods: {
    handleRegisterSubmit(event) {
      event.preventDefault();
      
      this.$store.dispatch('createCustomer', {
        email: this.$refs.emailInput.value,
        password: this.$refs.passwordInput.value,
      });
    },
  },
}
</script>