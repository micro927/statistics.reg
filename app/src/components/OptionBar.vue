<template>
  <div>
    <div class=" form-inline">
      <div class="mr-3 form-inline" v-if="ShowOrder.includes('s')">
        <select
          name="ShowSemester"
          v-model="ShowSemester"
          class="form-control"
          @change="
            this.$parent.ChangeParam($event.target.name, $event.target.value)
          "
        >
          <option disabled value="" selected>เลือกภาคการศึกษา</option>
          <option value="1">ภาคการศึกษาที่ 1</option>
          <option value="2">ภาคการศึกษาที่ 2</option>
          <option value="3">ภาคฤดูร้อน</option>
        </select>
      </div>
      <div class="mr-3 form-inline" v-if="ShowOrder.includes('c')">
        <select
          name="ShowSemesterCurrent"
          v-model="ShowSemesterCurrent"
          class="form-control"
          @change="
            this.$parent.ChangeParam($event.target.name, $event.target.value)
          "
        >
          <option disabled value="" selected>เลือกภาคการศึกษา</option>
          <option value="1">ภาคการศึกษาที่ 1</option>
          <option value="2">ภาคการศึกษาที่ 2</option>
          <option value="3">ภาคฤดูร้อน</option>
        </select>
      </div>
      <div class="mr-3 form-inline" v-if="ShowOrder.includes('y')">
        <select
          name="ShowYear"
          v-model="ShowYear"
          class="form-control"
          @change="
            this.$parent.ChangeParam($event.target.name, $event.target.value)
          "
        >
          <option disabled value="" selected>เลือกปีการศึกษา</option>
          <option v-for="year in YearOption" :key="year" :value="year">
            ปีการศึกษา {{ year }}
          </option>
        </select>
      </div>
      <div class="mr-3 form-inline" v-if="ShowOrder.includes('a')">
        <select
          name="ShowAdmitYear"
          v-model="ShowAdmitYear"
          class="form-control"
          @change="
            this.$parent.ChangeParam($event.target.name, $event.target.value)
          "
        >
          <option disabled value="" selected>
            เลือกรหัสนักศึกษา
          </option>
          <option value="999">ทั้งหมด</option>
          <option v-for="year in AdmitYearOption" :key="year" :value="year">
            รหัส {{ year }}
          </option>
        </select>
      </div>
      <div class="mr-3 form-inline" v-if="ShowOrder.includes('f')">
        <select
          name="ShowFac"
          v-model="ShowFac"
          class="form-control"
          @change="
            this.$parent.ChangeParam($event.target.name, $event.target.value)
          "
        >
          <option disabled value="" selected>เลือกคณะ</option>
          <option value="999">ทั้งหมด</option>
          <option
            v-for="fac in this.$store.state.FacultyList"
            :key="fac.faculty_id"
            :value="fac.faculty_id"
            >{{
              fac.faculty_id + " : " + fac.faculty_prefix + fac.faculty_name
            }}</option
          >
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OptionBar",
  props: ["order"],
  data() {
    return {
      ShowOrder: this.order,
      YearOption: [],
      AdmitYearOption: [],
      ShowSemester: this.$store.state.SemesterNow,
      ShowSemesterCurrent: this.$store.state.SemesterCurrentNow,
      ShowYear: this.$store.state.YearNow,
      ShowFac: this.$store.state.Fac,
      ShowAdmitYear: this.$store.state.AdmitYear,
    };
  },
  beforeMount() {
    var i;
    for (
      i = this.$store.state.YearNow;
      i > this.$store.state.YearNow - 10;
      i--
    ) {
      if (i < 2558) {
        break;
      }
      this.YearOption.push(i);
    }

    var j;
    for (
      j = this.$store.state.YearNow - 2500;
      j > this.$store.state.YearNow - 2510;
      j--
    ) {
      if (j < 58) {
        break;
      }
      this.AdmitYearOption.push(j);
    }
  },
  methods: {
    onChange: function(event) {
      console.log(event);
    },
  },
};
</script>

<style></style>
