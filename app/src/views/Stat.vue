<template>
  <div>
    <Breadcrumb :lists="BreadcrumbLists"></Breadcrumb>
    <div class="container-fluid mt-3">
      <div class="text-center pt-3 mb-4">
        <h2 class="text-primary">{{ StatTitle }}</h2>
        <h4>{{ OptionTitle }}</h4>
        <h5>{{ OptionsubTitle }}</h5>
      </div>

      <div class="row align-items-end pt-2 mb-3">
        <div class="col">
          <OptionBar :order="StatOrder" v-if="StatOrder.length" />
        </div>
        <div class="col text-right ">
          <span class="text-danger">
            <font-awesome-icon icon="info-circle" />
            หมายเหตุ : คลิกตารางและกดปุ่ม
            <span class="px-1"><font-awesome-icon icon="arrow-left"/></span>
            และ
            <span class="px-1"><font-awesome-icon icon="arrow-right"/></span>
            บนแป้นพิมพ์ เพื่อเลื่อนตาราง
          </span>
        </div>
      </div>

      <div v-if="StatData === ''" class="mt-5 text-center text-info">
        <font-awesome-icon icon="circle-notch" spin size="3x" />
        <h4 class="mt-3">
          ... กำลังจัดทำข้อมูลสถิติ, กรุณารอสักครู่ ...
        </h4>
      </div>
      <div v-else>
        <div v-if="ErrorCode === ''">
          <div class=" table-responsive">
            <table
              id="myTable"
              class="table table-sm table-bordered table-active text-center table-hover bg-white"
            >
              <thead style="position: sticky;top: 0">
                <tr v-for="row in StatHeader" :key="row.row">
                  <template v-for="x in row.iterate" :key="x">
                    <th
                      v-for="field in row.field"
                      :key="field"
                      :rowspan="field.rowspan"
                      :colspan="field.colspan"
                      class="table-active"
                    >
                      {{ field.name }}
                    </th>
                  </template>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in StatData" :key="row">
                  <td
                    v-for="(cell, name) in row"
                    :key="name"
                    class="text-nowrap"
                  >
                    <small v-if="isNaN(cell)">{{ cell }}</small>
                    <small v-else-if="cell > 0" :class="name">{{
                      cell.toLocaleString()
                    }}</small>
                    <small class="text-black-50" v-else>-</small>
                  </td>
                </tr>
                <tr id="RowSum"></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div
          v-else-if="ErrorCode === 'past_filter'"
          class="my-5 text-center text-secondary"
        >
          <hr />
          <font-awesome-icon
            icon="exclamation-triangle"
            class="text-warning"
            size="5x"
          />
          <h2 class="mt-2">ขออภัย</h2>
          <h4 class="mt-4">
            ข้อมูลสถิติย้อนหลังยังไม่สามารถให้บริการได้<br />กรุณาเลือกภาคการศึกษาที่สิ้นสุดไปแล้ว
          </h4>
          <hr />
        </div>
        <div v-else class="my-5 text-center text-secondary">
          <hr />
          <font-awesome-icon
            icon="exclamation-triangle"
            class="text-warning"
            size="5x"
          />
          <h2 class="mt-2">พบข้อผิดพลาด</h2>
          <h4 class="mt-4">ERROR CODE : {{ ErrorCode }}</h4>
          <hr />
        </div>
      </div>
      <div class="mt-2 text-center">
        <small ref="time" v-if="StatData !== ''">
          วันและเวลาที่เรียกดูข้อมูล : {{ FetchedTime }}</small
        >
        <div class="row justify-content-center mt-4">
          <div class="col-4 text-center ">
            <router-link
              class=" text-decoration-none text-white"
              :to="'/menu/' + ThisType"
            >
              <button class="btn btn-secondary btn-block">
                <font-awesome-icon icon="undo" class="mr-1" /> กลับไปหน้าเมนู
              </button>
            </router-link>
          </div>
        </div>
      </div>
      <PageFooter />
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Breadcrumb from "@/components/Breadcrumb.vue";
import OptionBar from "@/components/OptionBar.vue";
import PageFooter from "@/components/PageFooter.vue";
library.add(fas);

export default {
  name: "Stat",
  components: {
    Breadcrumb,
    OptionBar,
    PageFooter,
    FontAwesomeIcon,
  },
  data() {
    return {
      StatFullID: this.$route.params.menuid + this.$route.params.statid,
      TypeTitle: "",
      TypeTitleShort: "",
      StatTitle: "",
      StatTitleShort: "",
      StatHeader: "",
      StatData: "",
      StatOrder: "",
      BreadcrumbLists: "",
      FetchedTime: "-",
      ErrorCode: "",
      ShowSemester: this.$store.state.SemesterNow,
      ShowSemesterCurrent: this.$store.state.SemesterCurrentNow,
      ShowYear: this.$store.state.YearNow,
      ShowFac: this.$store.state.Fac,
      ShowAdmitYear: this.$store.state.AdmitYear,
    };
  },
  computed: {
    ThisType: function() {
      var result;
      var thistype = this.$route.params.menuid.substring(0, 1);
      if (thistype == "s") {
        result = "Student";
      } else if (thistype == "c") {
        result = "Curriculum";
      }
      return result;
    },
    FacultyName: function() {
      if (this.StatOrder.includes("f")) {
        var fPrefix = this.$store.state.FacultyList.find(
          (o) => o.faculty_id === this.ShowFac
        ).faculty_prefix;
        var fName = this.$store.state.FacultyList.find(
          (o) => o.faculty_id === this.ShowFac
        ).faculty_name;
        return fPrefix + fName;
      } else {
        return "";
      }
    },
    OptionTitle: function() {
      if (
        this.StatOrder.includes("s") ||
        this.StatOrder.includes("y") ||
        this.StatOrder.includes("c")
      ) {
        var s = this.StatOrder.includes("c")
          ? this.ShowSemesterCurrent
          : this.ShowSemester;
        var sText = s == 3 ? "ภาคฤดูร้อน" : "ภาคการศึกษาที่ " + s;
        var y = this.ShowYear;
        var yText = "ปีการศึกษา " + y;
        var fText = this.StatOrder.includes("f")
          ? this.ShowFac == "" || this.ShowFac == "999"
            ? ""
            : " (" + this.FacultyName + ")"
          : "";
        return sText + " " + yText + fText;
      } else {
        var fText2 = this.StatOrder.includes("f")
          ? this.ShowFac == "" || this.ShowFac == "999"
            ? ""
            : this.FacultyName
          : "";
        return fText2;
      }
    },
    OptionsubTitle: function() {
      var aText = this.StatOrder.includes("a")
        ? this.ShowAdmitYear == "" || this.ShowAdmitYear == "999"
          ? ""
          : " (ข้อมูลนักศึกษารหัส " + this.ShowAdmitYear + ")"
        : "";
      return aText;
    },
  },
  beforeMount() {
    this.axios
      .get(`${process.env.VUE_APP_API_URL}/v1/Stat${this.ThisType}List`)
      .then((response) => {
        this.Type = response.data;
        this.TypeTitle = this.Type.TypeTitle;
        this.TypeTitleShort = this.Type.TypeTitleShort;
        this.StatTitle = this.Type.TypeMenu.find(
          (o) => o.MenuId === this.$route.params.menuid
        ).Statistics.find(
          (o) => o.StatId === this.$route.params.statid
        ).StatTitle;
        this.StatTitleShort = this.Type.TypeMenu.find(
          (o) => o.MenuId === this.$route.params.menuid
        ).Statistics.find(
          (o) => o.StatId === this.$route.params.statid
        ).StatTitleShort;
      })
      .then(() => {
        this.BreadcrumbLists = [
          { name: this.TypeTitle, to: "/menu/" + this.ThisType.toLowerCase() },
          { name: this.StatTitleShort, to: "" },
        ];
        this.getstat();
      });
  },
  methods: {
    getstat() {
      this.StatData = "";
      this.axios
        .get(`${process.env.VUE_APP_API_URL}/v1/data/${this.StatFullID}`, {
          params: {
            year: this.ShowYear,
            semester: this.ShowSemester,
            semestercurrent: this.ShowSemesterCurrent,
            admityear: this.ShowAdmitYear,
            fac: this.ShowFac,
          },
        })
        .then((response) => {
          let stat = response.data;
          this.StatData = stat.data;
          this.StatOrder = stat.order;
          this.ErrorCode = stat.error;
          this.FetchedTime = Date();

          for (var r in stat.header) {
            for (var s in stat.header[r].field) {
              if (stat.header[r].field[s].name.substring(0, 5) == "{{y}}") {
                stat.header[r].field[s].name = eval(
                  this.$store.state.YearNow +
                    stat.header[r].field[s].name.substring(5)
                );
              } else if (
                stat.header[r].field[s].name.substring(0, 5) == "{{p}}"
              ) {
                stat.header[r].field[s].name = eval(
                  this.ShowYear + stat.header[r].field[s].name.substring(5)
                );
              }
            }
          }
          this.StatHeader = stat.header;
        })
        .then(() => {
          if (this.ErrorCode == "") {
            // Clear SUM row (DEBUG when getting 2nd time before 1st time not finish)
            document.querySelector("#RowSum").innerHTML = "";

            if (
              this.StatData !== "" &&
              typeof this.StatData !== "undefined" &&
              this.StatData.length > 0
            ) {
              // Create SUM row
              var AllCol = Object.keys(this.StatData[0]);
              var i;
              for (i in AllCol) {
                // add sum tr with Class
                var tr = document.createElement("td");
                tr.classList.add(AllCol[i] + "_sum", "small", "py-1");
                document.querySelector("#RowSum").append(tr);

                // Get value by class and then sum
                var AllColItems = document.querySelectorAll("." + AllCol[i]);
                var j;
                var temp_val = 0;
                for (j = 0; j < AllColItems.length; j++) {
                  temp_val =
                    temp_val +
                    parseInt(AllColItems[j].innerHTML.replace(/,/g, ""));
                }

                //Put sumvalue into each sum cell
                var SumValue;
                if (AllCol[i].substring(0, 1) == "c") {
                  SumValue = temp_val;
                } else {
                  SumValue = "รวมทั้งหมด";
                }
                document.querySelector(
                  "." + AllCol[i] + "_sum"
                ).innerHTML = SumValue.toLocaleString();
              }
            }
          }
        });
    },
    ChangeParam(param, value) {
      this[param] = value;
      this.getstat();
    },
  },
};
</script>

<style></style>
