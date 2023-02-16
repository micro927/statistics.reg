<template>
  <div>
    <Breadcrumb :lists="BreadcrumbLists"></Breadcrumb>
    <div class="container-fluid mt-4">
      <div>
        <h1 class="text-primary text-right">{{ TypeTitle }}</h1>
        <h5 class="text-right">
          สถิติข้อมูลทางทะเบียนการศึกษา มหาวิทยาลัยเชียงใหม่
        </h5>
      </div>
      <div
        class="card my-4 p-4"
        v-for="Menu in Type.TypeMenu"
        :key="Menu.MenuId"
      >
        <div class="" v-if="Menu.Statistics.length !== 0">
          <div class="py-2">
            <h4 class="text-primary">
              <font-awesome-icon :icon="['fas', Menu.MenuIcon]" />
              <span class="ml-3">{{ Menu.MenuTitle }}</span>
            </h4>
            <h6 class="text-black-50 pl-1">
              {{ Menu.MenuDesc }}
            </h6>
          </div>
          <ul
            class="list-group py-1"
            v-for="Stat in Menu.Statistics"
            :key="Stat.StatId"
          >
            <li class="list-group-item">
              <div class="row">
                <div class="col-lg-8">
                  <span>
                    <router-link
                      class=" text-decoration-none text-dark"
                      :to="'/stat/' + Menu.MenuId + '/' + Stat.StatId"
                    >
                      <font-awesome-icon
                        :icon="['fas', Menu.MenuIcon]"
                        class="mr-1"
                      />
                      {{ " " + Stat.StatTitle }}
                    </router-link>
                  </span>
                </div>
                <div class="col-lg-4 text-right">
                  <router-link
                    class=" text-decoration-none text-white"
                    :to="'/stat/' + Menu.MenuId + '/' + Stat.StatId"
                  >
                    <button class="btn btn-primary mx-2">
                      ดูสถิติ
                    </button>
                  </router-link>
                  <button
                    class="btn btn-outline-primary mx-2"
                    data-toggle="collapse"
                    :data-target="'#collapse-' + Menu.MenuId + Stat.StatId"
                    :aria-controls="'collapse-' + Menu.MenuId + Stat.StatId"
                    aria-expanded="false"
                  >
                    รายละเอียด
                  </button>
                </div>
              </div>
              <div
                class="collapse pt-3"
                :id="'collapse-' + Menu.MenuId + Stat.StatId"
              >
                <div class="card card-body">
                  {{ Stat.StatDesc }}
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="text-center" v-else>
          <h1>
            <font-awesome-icon
              :icon="['fas', 'exclamation-circle']"
              size="2x"
              class="mr-1"
            />
          </h1>
          <h1>ขออภัย</h1>
          <h3>ข้อมูลส่วนนี้ยังไม่เปิดให้บริการ</h3>
        </div>
      </div>
      <div class="text-center">
        <router-link class=" text-decoration-none text-white" :to="'/'">
          <button class="btn btn-secondary btn-lg  px-5">
            <font-awesome-icon icon="undo" class="mr-1" /> กลับไปหน้าแรก
          </button>
        </router-link>
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
import PageFooter from "@/components/PageFooter.vue";
library.add(fas);

export default {
  name: "Menu",
  components: {
    Breadcrumb,
    PageFooter,
    FontAwesomeIcon,
  },
  data() {
    return {
      Type: this.$route.params.type,
      TypeTitle: "",
      TypeTitleShort: "",
      BreadcrumbLists: "",
    };
  },
  mounted() {
    this.axios
      .get(
        `${process.env.VUE_APP_API_URL}/v1/Stat${this.$route.params.type}List`
      )
      .then((response) => {
        this.Type = response.data;
        this.TypeTitle = this.Type.TypeTitle;
        this.TypeTitleShort = this.Type.TypeTitleShort;
        this.bread = [
          {
            id: 1,
            btitle: this.TypeTitleShort,
            btitleShort: this.TypeTitleShort,
            url: { name: this.TypeRoute },
            active: true,
          },
        ];
        this.BreadcrumbLists = [{ name: this.TypeTitle, to: "#" }];
      });
  },
};
</script>

<style></style>
