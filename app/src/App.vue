<template>
  <div>
    <NavBar />
    <div class="d-none d-sm-block">
      <router-view />
    </div>
    <div class="d-block d-sm-none pt-5 mt-5 text-center">
      <h4 class="text-danger">ขออภัยในความไม่สะดวก</h4>
      <h5 class="mt-4 text-info">
        สำหรับอุปกรณ์เคลื่อนที่
      </h5>
      <h6>กรุณาปรับอุปกรณ์ของท่านให้แสดงผลในแนวนอน</h6>
      <h5 class="mt-4 text-info">สำหรับคอมพิวเตอร์</h5>
      <h6>กรุณาแสดงผลแบบเต็มหน้าจอ</h6>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar.vue";
export default {
  name: "App",
  created() {
    document.title = "สถิติข้อมูลทางทะเบียนการศึกษา มหาวิทยาลัยเชียงใหม่";
  },
  components: { NavBar },
  beforeMount() {
    if (this.$store.state.YearNow == "") {
      this.axios
        .get(`${process.env.VUE_APP_API_URL}/v1/Getoption`)
        .then((response) => {
          let data = response.data;
          this.$store.commit("setSemesterNow", data.app_semester[0].semester);
          this.$store.commit("setYearNow", data.app_semester[0].year);
          this.$store.commit("setFacultyList", data.faculty);
          // var ss =
          //   data.app_semester[0].semester == 3
          //     ? 2
          //     : data.app_semester[0].semester;
          var ss = data.app_semester[0].semester;
          this.$store.commit("setSemesterCurrentNow", ss);
        });
    }
  },
};
</script>

<style lang="scss">
@import "/scss/custom.scss";
@import url("https://fonts.googleapis.com/css2?family=Kanit&display=swap");
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: whitesmoke;
}

#app {
  font-family: "Kanit", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $secondary;
}
</style>
