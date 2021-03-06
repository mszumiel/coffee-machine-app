import Vue from 'vue'
import VueRouter from 'vue-router'

import MainPanel from './components/MainPanel'
import DiagnosticPanel from './components/DiagnosticPanel'

Vue.use(VueRouter);
export const router = new VueRouter({
    base: process.env.BASE_URL,
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