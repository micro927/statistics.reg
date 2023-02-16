import { createApp } from 'vue'
import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";
import App from './App.vue'
import router from './router'
import 'es6-promise/auto'
import 'bootstrap/dist/js/bootstrap.min.js'
import axios from 'axios'
import VueAxios from 'vue-axios'

const store = createStore({
    state() {
        return {
            SemesterNow: '',
            SemesterCurrentNow: '',
            YearNow: '',
            AdmitYear: '',
            Fac: '',
            FacultyList: []
        }
    },
    mutations: {
        setYearNow(state, year) {
            state.YearNow = year
        },
        setAdmitYear(state, year) {
            state.AdmitYear = year
        },
        setSemesterNow(state, semester) {
            state.SemesterNow = semester
        },
        setSemesterCurrentNow(state, semester) {
            state.SemesterCurrentNow = semester
        },
        setFac(state, fac) {
            state.Fac = fac
        },
        setFacultyList(state, faculty) {
            state.FacultyList = faculty
        }
    },
    plugins: [createPersistedState({ storage: window.sessionStorage, })],
})

createApp(App).use(VueAxios, axios).use(store).use(router).mount('#app')