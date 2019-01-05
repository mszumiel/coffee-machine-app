import 'es6-promise/auto'
import {store} from "./store/store"
import App from './App.vue'
import {router} from './router'
import './registerServiceWorker'
import './material'

import Vue from 'vue'
import {coffeeService} from "@/services/coffee.service";

Vue.config.productionTip = false;
Vue.use(require('vue-moment'));

coffeeService.getRecipes()
    .then((recipes) => {
        store.commit('setCoffeeRecipes', recipes);
    });

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App),
});