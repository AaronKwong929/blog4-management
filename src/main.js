import Vue from 'vue';
import App from './App.vue';
import router from './router';
// import store from "./store";

import ELEMENT from 'element-ui';
Vue.use(ELEMENT);

import './static/css/index.scss';
import './static/css/index.css';

import * as Axios from './utils/axios';
Vue.prototype.$axios = Axios;

import * as Api from './Api/api';
Vue.prototype.$api = Api;

import * as Auth from './utils/auth';
Vue.prototype.$auth = Auth;

import dateFormat from './utils/dateFormat';
Vue.prototype.$dateFormat = dateFormat;

Vue.config.productionTip = false;

new Vue({
    router,
    // store,
    render: h => h(App)
}).$mount('#app');
