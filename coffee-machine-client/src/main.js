import 'es6-promise/auto'

import {store} from "./store/store";

import App from './App.vue'
import {router} from './routing'

import './material'

import Vue from 'vue'
import axios from 'axios';
import {config} from './config'

Vue.config.productionTip = false;
Vue.use(require('vue-moment'));

axios.get(`${config.baseUrl}/coffee/recipes`)
    .then(response => {
        store.commit('setCoffeeRecipes', response.data);
    })
    .catch(e => {
        console.error(e);
    });

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App),
});