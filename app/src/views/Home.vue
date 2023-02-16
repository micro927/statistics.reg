<template>
  <div>
    <div class="container mt-5">
      <WelcomePage />
      <IndexRow />
    </div>
    <PageFooter />
  </div>
</template>

<script>
import WelcomePage from "@/components/WelcomePage.vue";
import IndexRow from "@/components/IndexRow.vue";
import PageFooter from "@/components/PageFooter.vue";

export default {
  name: "Home",
  components: {
    PageFooter,
    WelcomePage,
    IndexRow,
  },
};
</script>
