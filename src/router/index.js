import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
    { path: '/', redirect: 'login' },
    {
        path: '/login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/draft/:articleId',
        component: () => import('../views/Draft.vue'),
        meta: { requireAuth: true }
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/Admin.vue'),
        meta: { requireAuth: true }
    }
];

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        const token = localStorage.getItem(`token`);
        if (token && token !== null) {
            next();
        } else {
            next('/login');
        }
    } else {
        next();
    }
});
export default router;
