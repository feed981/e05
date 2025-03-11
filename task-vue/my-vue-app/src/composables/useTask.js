import { ref, computed, onMounted } from "vue";
import { useCommon } from "@/composables/useCommon.js";
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';

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

  const selectedCategory = ref('default');

  const newTask = ref(
    { 
      text: "", 
      date: setDate(), 
      opend: false, 
      urgent: false, 
      archive: false,
      completed: false,
      timestamp: Date.now(),
      updatetime: Date.now(),
    }
  );

  onMounted(() => {
    newTask.value.date = setDate();
  });


    // 待辦事項
  const taskList = ref(JSON.parse(localStorage.getItem("tasks")) || { "default": [] });

  const taskIndex = (category, timestamp) => {
      const taskIndex = taskList[category].findIndex(task => task.timestamp === timestamp);
      if (taskIndex === -1) return false; // 如果找不到，直接 return
      return taskIndex;
  };

  const afterTask = () => {
    selectedCategory.vallue = '';
    newTask.value.text = "";
    newTask.value.date = setDate;
    router.push('/tasks/list');
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
        successNotyftMessage(['Edit task successfully!','已修改任務內容!']);
    }catch{
        notyf.error("Edit task error!");
    }
    afterTask();
  };

  const addTask = () => {
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
    
    // 確保 selectedCategory 有值，且 taskList 中存在該類別
    if (selectedCategory.value && taskList.value[selectedCategory.value]) {
      
      
      // 深拷貝 newTask.value 以避免引用問題
      const taskCopy = JSON.parse(JSON.stringify(newTask.value));
      
      // 將任務添加到列表中
      taskList.value[selectedCategory.value].push(taskCopy);
      
      // 保存到本地存儲
      localStorage.setItem("tasks", JSON.stringify(taskList.value));

      successNotyftMessage(['Add task successfully!','已新增一項任務!']);
    } else {
        warningNotyftMessageCheckData([`'${selectedCategory.value}' category error!`,`'${selectedCategory.value}' 無效的類別或類別未定義`]);
        return;
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
    addTask,
    editTask,
    copyTask,
    finishTask,
    setUrgentTask,
    removeTask,
    newTask,
    selectedCategory,
  };
}
