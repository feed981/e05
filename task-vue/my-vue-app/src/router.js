import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import QRCode from './views/QRCode.vue';
import Feedback from './views/Feedback.vue';
import ImportAsJson from './views/ImportAsJson.vue';
import CategoryList from './views/CategoryList.vue';
import CategoryTaskList from './views/CategoryTaskList.vue';
import CategoryTaskDateList from './views/CategoryTaskDateList.vue';
import TasksNew from '@/components/TasksNew.vue';

import { useMenuStore } from '@/store/useStore';
import { useTask } from "@/composables/useTask.js";

const routes = [
  { path: '/', component: Home },
  { path: '/qrcode', component: QRCode },
  { path: '/feedback', component: Feedback },
  { path: '/import/as/json', component: ImportAsJson },
  { path: '/tasks/new', component: TasksNew },
  { path: '/category/list', component: CategoryList },
  { path: '/:category/tasks', component: CategoryTaskList },
  { path: '/:category/tasks/:date', component: CategoryTaskDateList },
  // { path: '/category/tasks/archive', component: CategoryTasksArchive },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const menuStore = useMenuStore(); // 確保 store 在這裡被調用
  const task = useTask(); // 確保 store 在這裡被調用
  //  close menu
  if (to.path === '/') {
    task.isEdit.value = false;
  }else if (to.path === '/tasks/new') {
    task.isEdit.value = false;
  }else{ 
    menuStore.isOpen = false;
    // console.log(to.path)
  }
  next();
});

export default router;
