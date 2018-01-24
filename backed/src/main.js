// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'

import '@/assets/css/base.css';
import '@/assets/css/product.css';
import '@/assets/css/checkout.css';
import '@/assets/css/login.css';

import NavHeader from '@/components/NavHeader';
import NavFooter from '@/components/NavFooter';
import NavBread from '@/components/NavBread';
import Modal from '@/components/Modal'

import axios from 'axios';
import qs from 'qs'

Vue.config.productionTip = false

Vue.component('NavHeader',NavHeader);
Vue.component('NavFooter',NavFooter);
Vue.component('NavBread',NavBread);
Vue.component('Modal',Modal);

Vue.use(VueLazyload,{
  loading: 'static/loading-svg/loading-bars.svg',
  try: 3 // default 1
})

Vue.use(infiniteScroll)

Vue.prototype.$axios = axios;
// axios.defaults.baseURL = 'http://localhost:3000';
// axios.defaults.withCredentials = true;
// 添加请求拦截器  POST传参序列化
/* axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data);
  }
  return config;
}, (error) => {
  console.log('错误的传参', 'fail');
  return Promise.reject(error);
}); */






/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
