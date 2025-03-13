import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import QRCode from './views/QRCode.vue';
import Feedback from './views/Feedback.vue';
import ImportAsJson from './views/ImportAsJson.vue';
import Category from './views/Category.vue';
import CategoryTaskList from './views/CategoryTaskList.vue';
import CategoryTasksArchive from './views/CategoryTasksArchive.vue';
import Tasks from './views/Tasks2.vue';

import { useMenuStore } from '@/store/useStore';

const routes = [
  { path: '/', component: Home },
  { path: '/qrcode', component: QRCode },
  { path: '/feedback', component: Feedback },
  { path: '/import/as/json', component: ImportAsJson },
  { path: '/category/list', component: Category },
  { path: '/:category/tasks', component: CategoryTaskList },
  { path: '/category/tasks/archive', component: CategoryTasksArchive },
  { path: '/tasks/new', component: Tasks },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const menuStore = useMenuStore(); // 確保 store 在這裡被調用
  //  close menu
  if (to.path === '/import/as/json') {
    menuStore.toggleBars();
    console.log(to.path)
  }else{ 
  }
  next();
});

export default router;
