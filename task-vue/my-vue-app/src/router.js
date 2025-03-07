import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import QRCode from './views/QRCode.vue';
import Feedback from './views/Feedback.vue';
import ImportAsJson from './views/ImportAsJson.vue';
import CategoryList from './views/CategoryList.vue';
import CategoryTasks from './views/CategoryTasks.vue';
import CategoryTasksArchive from './views/CategoryTasksArchive.vue';
import Tasks from './views/Tasks.vue';

const routes = [
  { path: '/', component: Home },
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

export default router;
