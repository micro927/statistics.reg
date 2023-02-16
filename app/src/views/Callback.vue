<template>
  <p class="text-center">
    Authorizing ...
  </p>
</template>

<script>
export default {
  async beforeMount() {
    if (this.$route.query.code) {
      try {
        const response = await this.$auth.loginWith("local", {
          data: {
            code: this.$route.query.code,
            state: this.$route.query.state,
          },
        });
        if (response.data.success) {
          this.$router.replace("/");
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    }
  },
};
</script>
