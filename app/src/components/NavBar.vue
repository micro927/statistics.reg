<template>
  <div class="position-sticky">
    <nav class=" d-flex flex-row navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">
        <img
          src="../assets/cmu.png"
          width="25"
          height="25"
          class="d-inline-block mb-1"
        />
        <small class="ml-2 d-none d-md-inline"
          >สถิติข้อมูลทางทะเบียนการศึกษา มหาวิทยาลัยเชียงใหม่</small
        >
        <small class="ml-2 d-inline d-md-none"
          >สถิติข้อมูลทางทะเบียนการศึกษา มช.</small
        >
      </router-link>
      <!-- <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button> -->
    </nav>
  </div>
</template>
<script>
export default {
  name: "NavBar",
};
</script>
