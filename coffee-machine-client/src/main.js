import Vue from 'vue'
import App from './App.vue'

import 'es6-promise/auto'

import VueRouter from 'vue-router'
import MainPanel from './components/MainPanel'
import DiagnosticPanel from './components/DiagnosticPanel'

Vue.use(VueRouter);
const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'MainPanel',
            component: MainPanel
        },
        {
            path: '/diagnostic',
            name: 'DiagnosticPanel',
            component: DiagnosticPanel
        }
    ]
});

import { MdContent, MdButton, MdIcon, MdDialog, MdDialogPrompt, MdProgress, MdTable, MdCard } from 'vue-material/dist/components'

import {  } from 'vue-material/dist/components'
import 'eslint/lib/util/ast-utils'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.config.productionTip = false;
Vue.use(require('vue-moment'));
Vue.use(MdContent);
Vue.use(MdButton);
Vue.use(MdIcon);
Vue.use(MdDialog);
Vue.use(MdDialogPrompt);
Vue.use(MdProgress);
Vue.use(MdTable);
Vue.use(MdCard);

export const store = {
    debug: true,
    state: {
        status: null
    },
    setStatus (status) {
        this.state.status = status
    }
};

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');

//module.exports = {store};
