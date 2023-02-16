<template>
  <div class="row">
    <div class="col-md-6">
      <router-link style=" text-decoration: none;" class="" to="/menu/student">
        <button class="text-white btn p-4 btn-lg btn-block btn-primary">
          <span class="h3">สถิติข้อมูลนักศึกษา</span>
        </button>
      </router-link>
    </div>
    <div class="col-md-6">
      <router-link
        style=" text-decoration: none;"
        class=""
        to="/menu/curriculum"
      >
        <button class="text-white btn p-4 btn-lg btn-block btn-success">
          <span class="h3">สถิติข้อมูลหลักสูตร</span>
        </button>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: "IndexRow",
};
</script>
