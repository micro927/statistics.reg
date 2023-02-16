<template>
  <div>
    <nav
      class="d-flex flex-row navbar navbar-light bg-white sticky-top"
      aria-label="breadcrumb"
    >
      <div class="container-fluid d-float py-1 px-1">
        <div class="d-inline">
          <span class="pr-2"><font-awesome-icon icon="chart-bar" /> </span>
          <router-link to="/" class=" text-secondary">หน้าแรก</router-link>
          <template v-for="list in lists" :key="list">
            <span class="px-2"
              ><font-awesome-icon icon="angle-double-right"
            /></span>
            <router-link :to="list.to" class=" text-secondary">
              {{ list.name }}
            </router-link>
          </template>
        </div>
        <div class="d-float text-info">
          <span>
            <font-awesome-icon icon="calendar-alt" class="mr-1" />
            <span class="">
              ภาคการศึกษาปัจจุบัน
              <font-awesome-icon icon="chevron-right" size="xs" class="mx-1" />
            </span>
            {{ SemesterYearNowTiltle }}
          </span>
        </div>
      </div>
    </nav>
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(fas);

export default {
  name: "Breadcrumb",
  props: ["lists"],
  components: {
    FontAwesomeIcon,
  },
  computed: {
    SemesterYearNowTiltle: function() {
      var sNow = this.$store.state.SemesterNow;
      var sNowText = sNow == 3 ? "ฤดูร้อน" : sNow;
      return sNowText + " /" + this.$store.state.YearNow;
    },
  },
};
</script>
