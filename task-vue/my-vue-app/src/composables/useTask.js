import { ref, computed, onMounted } from "vue";

export function useTask() {
  // 待辦事項
  const taskList = ref(JSON.parse(localStorage.getItem("tasks")) || { "default": [] });

  // 計算是否有任務
  const isListVisible = computed(() => Object.keys(taskList.value).length > 0);

  // 計算每個分類的總數量
  const allTaskCount = (category) => {
    return taskList.value[category]?.filter(task => task.text).length || 0;
  };

  // 計算已完成的任務數量
  const finishTaskCount = (category) => {
    return taskList.value[category]?.filter(task => task.completed).length || 0;
  };

  // 計算緊急任務數量
  const urgentTaskCount = (category) => {
    return taskList.value[category]?.filter(task => task.urgent).length || 0;
  };

  // 整理所有任務
  const allTasklist = computed(() => {
    const allTasks = [];

    // 遍歷分類，整理資料
    Object.entries(taskList.value).forEach(([category, items]) => {
      items.forEach(item => {
        allTasks.push({ ...item, category });
      });
    });

    // 按日期降序排序
    allTasks.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 按 category 和 date 分組
    const groupedTasks = {};

    allTasks.forEach(task => {
      const completedStatus = String(task.completed);

      if (!groupedTasks[task.category]) {
        groupedTasks[task.category] = {};
      }
      if (!groupedTasks[task.category][task.date]) {
        groupedTasks[task.category][task.date] = { true: [], false: [] };
      }

      groupedTasks[task.category][task.date][completedStatus].push(task.text);
    });

    return groupedTasks;
  });

  // 監聽 localStorage 變化
  onMounted(() => {
    window.addEventListener("storage", () => {
      taskList.value = JSON.parse(localStorage.getItem("tasks")) || { "default": [] };
    });
  });

  return {
    taskList,
    isListVisible,
    allTaskCount,
    finishTaskCount,
    urgentTaskCount,
    allTasklist,
  };
}
