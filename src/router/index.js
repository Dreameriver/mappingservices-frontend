import { createRouter, createWebHistory } from 'vue-router';
import home from '../components/Home.vue';
import search from '../components/search.vue';
import by_region from '../components/by_region.vue';
import by_tag from '../components/by_tag.vue';
import shop from '../components/shop.vue';
import about from '../components/about.vue';
import add_shop from '../components/add_shop.vue';
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
      path: '/maintenance',
      name: 'Maintenance',
      children: [
          {
              path: 'tags/:sid',
              component: () => import('../components/maintenance/tags.vue')
          },
          {
              path: 'info/:sid',
              component: () => import('../components/maintenance/shop_info.vue')
          }
          ],
    },
    {
        path: '/by_tag',
        name: 'by_tag',
        component: by_tag
    },
    {
        path: '/add_shop',
        name: 'add_shop',
        component: add_shop
    },
    {
        path: '/changelogs',
        name: 'changelogs',
        component: () => import('../components/changelog.vue')
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
