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
import NotFound from '@/views/404.vue'  // 你的 404 頁面

const routes = [
  // 重定向從根路徑到 /v2
  { path: '/', redirect: '/v2' },
  // 讓 /index.html 轉向 /v2
  { path: '/index.html', redirect: '/v2' },
  { path: '/v2/index.html', redirect: '/v2' },
  { path: '/:pathMatch(.*)*', component: NotFound },  // 捕獲所有未定義路徑
  {
    path: '/v2',
    children: [
      { path: '', name: 'v2.home', component: Home },
      { path: 'qrcode', name: 'v2.qrcode', component: QRCode },
      { path: 'feedback', name: 'v2.feedback', component: Feedback },
      { path: 'import/as/json', name: 'v2.import.json', component: ImportAsJson },
      { path: 'tasks/new', name: 'v2.tasks.new', component: TasksNew },
      { path: 'category/list', name: 'v2.category.list', component: CategoryList },
      { path: ':category/tasks', name: 'v2.category.tasks', component: CategoryTaskList },
      { path: ':category/tasks/:date', name: 'v2.category.tasks.date', component: CategoryTaskDateList },
    ]
  }
];

const router = createRouter({
  history: createWebHistory('/'),//使用 history 模式並設置 base URL
  routes
});

router.beforeEach((to, from, next) => {
  const menuStore = useMenuStore(); // 確保 store 在這裡被調用
  const task = useTask(); // 確保 store 在這裡被調用
  //  close menu
  task.isEdit.value = false;
  menuStore.isOpen = false;
  // console.lg(to.path)
  next();
});

router.afterEach(() => {
  // 當路由變化時重新加載廣告
  if (window.adsbygoogle) {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }
});

export default router;
