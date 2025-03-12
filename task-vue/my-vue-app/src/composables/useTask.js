import { ref, computed, onMounted, toRaw } from "vue";
import { useCommon } from "@/composables/useCommon.js";
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';

import { useCategory } from "@/composables/useCategory.js";


export function useTask() {
  const router = useRouter();
  const setDate = (timestamp) => {
    return dayjs(timestamp).format('YYYY-MM-DD');
  };

  const { 
      playSoundtrack,
      successNotyftMessageWithST,
      successNotyftMessage,
      warningNotyftMessageCheckData,
  } = useCommon();

  const selectedCategory = ref('works');
  const task = ref({
    text: '',
    date: setDate(),
  });

  
    
  const {
    categories,
    saveToLocalStorage,
  } = useCategory();
  
  // 添加任务到分类的函数
  const addTaskToCategory = (type, task) => {
    const categoryName = selectedCategory.value;
    
    if (!categoryName) {
      warningNotyftMessageCheckData(['Please select your category!','請先選擇類別!']);
      return;
    }
    
    if (!task.date) {
      warningNotyftMessageCheckData(['Please select your date!','請選擇日期!']);
      return;
    }
  
    if (!task.text.trim()) {
      warningNotyftMessageCheckData(['Please input your task content!','請輸入任務內容!']);
      return;
    }

    if (!categories[categoryName]) {
      console.error(`Category ${categoryName} does not exist!`);
      return;
  }


  if (!categories[categoryName].tasks) {
    console.error(`tasks does not exist!`);
    return;
  }else{
    console.log('categories[categoryName]:'+categories[categoryName].tasks)

  }
      // 添加任务到对应分类
  const newTask = {
    id: Date.now().toString(), // 简单的唯一ID
    text: task.text,
    date: task.date || setDate(),
    opend: false,
    urgent: task.urgent || false,
    archive: false,
    completed: false,
    timestamp: Date.now(),
    updatetime: Date.now(),
  };
    
    categories[categoryName].tasks.push(newTask);
    
    // 保存到localStorage
    saveToLocalStorage();
  if(type === 'add'){
    successNotyftMessage(['Add task successfully!','已新增一項任務!']);

  }else if(type === 'edit'){
    successNotyftMessage(['Edit task successfully!','已修改任務內容!']);
  }else{
    return;
  }
    selectedCategory.value = 'works';
    task.text = '';
    task.date = setDate;
    router.push('/tasks/list');
  };
  

  // 計算所有任務數量
  const allTaskCount = (category) => {
    if (!categories[category]) return 0; // 確保分類存在
    return categories[category].tasks.length; // 獲取該分類下所有任務數量
  };

  // 計算已完成的任務數量
  const finishTaskCount = (category) => {
    if (!categories[category]) return 0; // 確保分類存在
    return categories[category].tasks.filter(task => task.completed).length;
  };


  // 計算緊急任務數量
  const urgentTaskCount = (category) => {
    if (!categories[category]) return 0;
    return categories[category].tasks.filter(task => task.urgent).length || 0;
  };

  const allTasklist = computed(() => {
    const sortedCategories = Object.entries(categories)
      .sort(([, a], [, b]) => b.info.updatetime - a.info.updatetime) // 根據 updatetime 降序排列 categories
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  
    const allTasks = [];
  
    // 遍歷分類，整理數據
    Object.entries(sortedCategories).forEach(([category, data]) => {
      // 確保 tasks 存在並且進行 updatetime 降序排序
      const sortedTasks = [...data.tasks].sort((a, b) => b.updatetime - a.updatetime);
  
      sortedTasks.forEach(task => {
        allTasks.push({ ...task, category });
      });
    });
  
    // 按日期降序排序
    allTasks.sort((a, b) => new Date(b.date) - new Date(a.date));
  
    // 按 category 和 date 分組
    const groupedTasks = {};
  
    allTasks.forEach(task => {
      const completedStatus = task.completed ? "true" : "false";
  
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


  // todo: 




  const taskIndex = (category, timestamp) => {
      const taskIndex = taskList[category].findIndex(task => task.timestamp === timestamp);
      if (taskIndex === -1) return false; // 如果找不到，直接 return
      return taskIndex;
  };





  
const editTask = () => {
  successNotyftMessage(['Edit your task content!','請修改任務內容!']);
  if (!selectedCategory.value) {
    warningNotyftMessageCheckData(['Please select your category!','請先選擇類別!']);
    return;
  }
  
  if (!newTask.value.date) {
    warningNotyftMessageCheckData(['Please select your date!','請選擇日期!']);
    return;
  }
  
  if (!newTask.value.text.trim()) {
    warningNotyftMessageCheckData(['Please input your task content!','請輸入任務內容!']);
    return;
  }

  try{
      const taskIndex = taskIndex(selectedCategory, newTask.timestamp);
      if(!taskIndex) {
        warningNotyftMessageCheckData(['Missing data!','缺失数据!']);
        return;
      }
      taskList[selectedCategory][taskIndex].text = newTask.text;
      taskList[selectedCategory][taskIndex].date = newTask.date;
      taskList[selectedCategory][taskIndex].timestamp = Date.now();
      taskList[selectedCategory][taskIndex].updatetime = Date.now();
      localStorage.setItem("tasks", JSON.stringify(taskList));
      
  }catch{
      notyf.error("Edit task error!");
  }
  afterTask();
};


  const copyTask = (text) => {
    navigator.clipboard.writeText(text.trim())
        .then(() => notyf.success("Copy success task text successfully!"))
        .catch(err => console.error("Copy error!", err));
  };

  const finishTask = (category, timestamp) => {
    const taskIndex = taskIndex(category, timestamp);
    if(!taskIndex) {
      warningNotyftMessageCheckData(['Missing data!','缺失数据!']);
      return;
    }
    taskList[category][taskIndex].completed = !taskList[category][taskIndex].completed;
    taskList[category][taskIndex].urgent = false;
    localStorage.setItem("tasks", JSON.stringify(taskList));

    if(taskList[category][taskIndex].completed){
      successNotyftMessageWithST(
        ['Finish task successfully!','順利完成任務!'],
        'black-and-white-ost-disc-3-mission-success.mp3'
      );
    }else{
      successNotyftMessageWithST(
        ['Cancel finish task successfully!','重啟任務!'],
        'gta-san-andreas-ah-shit-here-we-go-again_BWv0Gvc.mp3'
      );
    }
  };

  const archiveTask = (category, timestamp) => {
    const taskIndex = taskIndex(category, timestamp);
    if(!taskIndex) {
      warningNotyftMessageCheckData(['Missing data!','缺失数据!']);
      return;
    }
    taskList[category][taskIndex].archive = !taskList[category][taskIndex].archive;
    localStorage.setItem("tasks", JSON.stringify(taskList));

    if(taskList[category][taskIndex].archive){
        successNotyftMessage(['Archive task successfully!','已將任務封存!']);
    }else{
        successNotyftMessage(['Cancel archive task successfully!','取消任務封存!']);
    }
  };

  const setUrgentTask = (category, timestamp) => {
    const taskIndex = taskIndex(category, timestamp);
    if(!taskIndex) {
      warningNotyftMessageCheckData(['Missing data!','缺失数据!']);
      return;
    }
    if(!taskList[category][taskIndex].completed){
        taskList[category][taskIndex].urgent = !taskList[category][taskIndex].urgent;
        localStorage.setItem("tasks", JSON.stringify(taskList));

        if(taskList[category][taskIndex].urgent){
          successNotyftMessageWithST(
            ['Urgent task successfully!','已將任務狀態設置為緊急!'],
            'gan-wu-hua-dou.mp3'
          );
        }
    }else{
        warningNotyftMessageCheckData(['You cannot set urgent cause this task is already finish!','無法將任務設置為緊急因為任務已經結束!']);
    }
  };

  const removeTask = (category, timestamp, text) => {
      if (windowConfirm([`Are you sure you want to delete '${text}'?`,`你確定要刪除'${text}'嗎?`])) {
          taskList[category] = taskList[category].filter(task => task.timestamp !== timestamp);
          localStorage.setItem("tasks", JSON.stringify(taskList));

          successNotyftMessage([`Successfully deleted '${text}' permanently.`,`已經永久刪除 '${text}'`]);
      }
  };

  // 計算是否有任務
  const isListVisible = computed(() => Object.keys(taskList.value).length > 0);

  

  // 監聽 localStorage 變化
  onMounted(() => {
    window.addEventListener("storage", () => {
      taskList.value = JSON.parse(localStorage.getItem("tasks")) || { "default": [] };
    });
  });

  return {
    task,
    isListVisible,
    allTaskCount,
    finishTaskCount,
    urgentTaskCount,
    allTasklist,
    addTaskToCategory,
    editTask,
    copyTask,
    finishTask,
    setUrgentTask,
    removeTask,
    selectedCategory,
  };
}
