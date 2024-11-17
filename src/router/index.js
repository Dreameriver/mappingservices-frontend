import { createRouter, createWebHistory } from 'vue-router';
import home from '../components/Home.vue';
import search from '../components/search.vue';
import by_region from '../components/by_region.vue';
import by_tag from '../components/by_tag.vue';
import shop from '../components/shop.vue';
import about from '../components/about.vue';
const routes = [
    {
        path: '/',
        name: 'Home',
        component: home
    },
    {
        path: '/shop/:sid',
        name: 'Shop',
        component: shop
    },
    {
        path: '/search',
        name: 'Search',
        component: search
    },
    {
        path: '/by_region',
        name: 'by_region',
        component: by_region
    },
    {
        path: '/by_tag',
        name: 'by_tag',
        component: by_tag
    },
    {
        path: '/about',
        name: 'About',
        component: about
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
