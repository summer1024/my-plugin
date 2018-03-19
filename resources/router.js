import Vue from 'vue';
import VueRouter from 'vue-router';
import Tree from './pages/indexTree.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '',
        component: Tree
    }
];

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router;