import { createRouter, createWebHistory } from 'vue-router';
import TaskList from './views/TaskList.vue';
import QRCode from './views/QRCode.vue';
import Feedback from './views/Feedback.vue';
import ImportAsJson from './views/ImportAsJson.vue';
import CategoryList from './views/CategoryList.vue';
import CategoryTasks from './views/CategoryTasks.vue';
import CategoryTasksArchive from './views/CategoryTasksArchive.vue';
import Tasks from './views/Tasks.vue';

import { useMenuStore } from '@/store/useStore';

const routes = [
  { path: '/tasks/list', component: TaskList },
  { path: '/qrcode', component: QRCode },
  { path: '/feedback', component: Feedback },
  { path: '/import/as/json', component: ImportAsJson },
  { path: '/category/list', component: CategoryList },
  { path: '/category/tasks', component: CategoryTasks },
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
  if (to.path === '/feedback') {
  }else{ 
    menuStore.toggleBars();
    console.log(to.path)
  }
  next();
});

export default router;
