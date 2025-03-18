import { ref, computed } from "vue";
import { useCommon } from "@/composables/useCommon.js";
import { useDate } from "@/composables/useDate.js";
import { useRouter } from 'vue-router';
import { useCategory } from "@/composables/useCategory.js";

const isEdit = ref(false);

const { 
  setDate,
} = useDate();

const task = ref({
  text: '',
  date: setDate(),
});

const selectedCategory = ref('');

const editTask = ref({
  id: '',
  categoryName: '',
  text: '',
  date: setDate(),
  updatetime: Date.now(),
  urgent: false,
  completed: false,
  archive: false,
  opend: false
});



export function useTask() {
  const router = useRouter();

  const { 
    windowConfirm,
    successNotyftMessageWithST,
    successNotyftMessage,
    warningNotyftMessageCheckData,
  } = useCommon();
    
  const {
    categories,
    saveToLocalStorage,
  } = useCategory();


  
  const checkTaskToCategoryData = (task) => {
    const categoryName = selectedCategory.value;
    if (!categoryName) {
      warningNotyftMessageCheckData(['Please select your category!','請先選擇類別!']);
      return false;
    }
    
    if (!task.date) {
      warningNotyftMessageCheckData(['Please select your date!','請選擇日期!']);
      return false;
    }
    
    if (!task.text.trim()) {
      warningNotyftMessageCheckData(['Please input your task content!','請輸入任務內容!']);
      return false;
    }
    
    if (!categories[categoryName]) {
      console.error(`Category ${categoryName} does not exist!`);
      return false;
    }
    
    
    if (!categories[categoryName].tasks) {
      console.error(`tasks does not exist!`);
      return false;
      // }else{
        //   console.log('categories[categoryName]:'+categories[categoryName].tasks)

    }
    return true;
  }

  const newTaskToCategory = (task) => {
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
    categories[selectedCategory.value].tasks.push(newTask);
  }

  // 添加任务到分类的函数
  const addTaskToCategory = (task) => {

    if(!checkTaskToCategoryData(task)) return;
    newTaskToCategory(task);

    // 保存到localStorage
    saveToLocalStorage();
    successNotyftMessage(['Add task successfully!','已新增一項任務!']);

    task.text = '';
    router.push('/');
  };
  

  // 計算所有任務數量
  const allTaskCount = (category, date) => {
    if (!categories[category]) return 0; // 確保分類存在
    if(date){
      return categories[category].tasks.filter(
        task => task.date === date
      ).length;
    }
    return categories[category].tasks.length; // 獲取該分類下所有任務數量
  };

  // 計算已完成的任務數量
  const finishTaskCount = (category, date) => {
    if (!categories[category]) return 0; // 確保分類存在
    if(date){
      return categories[category].tasks.filter(
        task => task.date === date && task.completed
      ).length;
    }
    return categories[category].tasks.filter(task => task.completed).length;
  };

  const NotfinishTaskDateCount = (category, date) => {
    if (!categories[category]) return 0; // 確保分類存在
    return categories[category].tasks.filter(
      task => !task.completed && task.date === date
    ).length;
  };


  // 計算緊急任務數量
  const urgentTaskCount = (category, date) => {
    if (!categories[category]) return 0;
    if(date){
      return categories[category].tasks.filter(
        task => task.date === date && task.urgent
      ).length;
    }
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
      const completedStatus = task.completed ? "completed" : "normal";
      const urgentStatus = task.urgent ? "urgent" : "normal";
  
      if (!groupedTasks[task.category]) {
        groupedTasks[task.category] = {};
      }
      // 單個條件可使用這種方式
      // if (!groupedTasks[task.category][task.date]) {
      //   groupedTasks[task.category][task.date] = { true: [], false: [] };
      // }

      if (!groupedTasks[task.category][task.date]) {
        groupedTasks[task.category][task.date] = [];  // 使用数组而不是对象
      }
      // 确定任务状态
      let status;
      if (task.completed) {
        status = "completed";
      } else if (task.urgent) {
        status = "urgent";
      } else {
        status = "normal";
      }

      // 将任务添加到数组中，并包含状态信息
      groupedTasks[task.category][task.date].push({
        text: task.text,
        updatetime: task.updatetime,
        status: status
      });

    });
  
    return groupedTasks;
  });


  const taskFind = (category, date, timestamp) => {
      return categories[category].tasks.find(
        task => task.date === date && task.updatetime === timestamp
      );
  };

  const setUrgentTask = (category, date, timestamp) => {
    // Find the task that matches the date and timestamp
    const targetTask = taskFind(category, date, timestamp);
    
    if (!targetTask) {
      warningNotyftMessageCheckData(['Missing data!','缺失数据!']);
      return;

    }

    // If the task exists, toggle its urgent status
    if (targetTask) {
      targetTask.urgent = !targetTask.urgent;
      if(targetTask.urgent){
        successNotyftMessageWithST(
          ['Urgent task successfully!','已將任務狀態設置為緊急!'],
          'gan-wu-hua-dou.mp3'
        );
      }else{
        successNotyftMessage(
          ['Cancel Urgent task successfully!','任務沒有很緊急!']
        );
      }
      saveToLocalStorage();
      // router.go(0);
    }
  };

  const finishTask = (category, date, timestamp) => {
    // Find the task that matches the date and timestamp
    const targetTask = taskFind(category, date, timestamp);
    
    if (!targetTask) {
      warningNotyftMessageCheckData(['Missing data!','缺失数据!']);
      return;

    }

    // If the task exists, toggle its urgent status
    if (targetTask) {
      targetTask.completed = !targetTask.completed;
      if(targetTask.completed){
        successNotyftMessageWithST(
          ['Finish task successfully!','順利完成任務!'],
          'black-and-white-ost-disc-3-mission-success.mp3'
        );
      }else{
        successNotyftMessage(
          ['Cancel finish task successfully!','重啟任務!'],
        );
        // successNotyftMessageWithST(
        //   ['Cancel finish task successfully!','重啟任務!'],
        //   'gta-san-andreas-ah-shit-here-we-go-again_BWv0Gvc.mp3'
        // );
      }
      saveToLocalStorage();
      // router.go(0);
    }
  };


  const setEditTask = (category, date, timestamp, text) => {
    
      // Find the task that matches the date and timestamp
    const targetTask = taskFind(category, date, timestamp);
    
    if (!targetTask) {
      warningNotyftMessageCheckData(['Missing data!','缺失数据!']);
      return;

    }

    // If the task exists, toggle its urgent status
    if (targetTask) {
      editTask.value = {
        id: targetTask.id,
        category,
        text: targetTask.text,
        date: targetTask.date,
        updatetime: targetTask.updatetime,
        urgent: targetTask.urgent,
        completed: targetTask.completed,
        archive: targetTask.archive,
        opend: targetTask.opend
      };
      selectedCategory.value = category;
      task.value.text = text;
      task.value.date = date;
      isEdit.value = true;
    }

  };


  const removeTask = (categoryName, date, updatetime, text) => {
    if (windowConfirm([`Are you sure you want to delete '${categoryName}', date: ${date}, task content: '${text}'?`,`你確定要刪除${categoryName} 類別中日期為 ${date} 任務內容為：'${text}' 的任務嗎?`])) {
      removeTaskByDateAndUpdatetime(categoryName, date, updatetime, true);
      saveToLocalStorage();
      if(NotfinishTaskDateCount(categoryName, date) > 0){
        router.go(0);
      }else{
        router.push('/');
      }
    }
  }

  const removeTaskByDateAndUpdatetime = (categoryName, date, updatetime, isRemove) => {
    // 確保該類別存在
    if (categories[categoryName] && categories[categoryName].tasks) {
      // 使用 filter 方法過濾掉同時符合指定日期和 updatetime 的任務
      categories[categoryName].tasks = categories[categoryName].tasks.filter(
        task => !(task.date === date && task.updatetime === updatetime)
      );
      if(isRemove){

        successNotyftMessage(
          [`Remove '${categoryName}', date: ${date}, task successfully!`,`已移除 ${categoryName} 類別中日期為 ${date} 且 updatetime 為 ${updatetime} 的任務!`]
        );
        
      }
    } else {
      successNotyftMessage(
        [`Can't find '${categoryName}' task!`,`找不到 ${categoryName} 類別或其任務列表!`]
      );
    }
  };

  const editTaskToCategory = (task) => {

    if (isEdit.value && editTask.value.id) {

       // Find the task that matches the date and timestamp
      const targetTask = taskFind(
        editTask.value.category, 
        editTask.value.date, 
        editTask.value.updatetime
      );
      
      if (!targetTask) {
        warningNotyftMessageCheckData(['Missing data!','缺失数据!']);
        return;
        
      }
      
      if(!checkTaskToCategoryData(task)) return;

      if (targetTask !== -1) {
        if(selectedCategory.value !== editTask.value.category){
          removeTaskByDateAndUpdatetime(
            editTask.value.category, 
            editTask.value.date, 
            editTask.value.updatetime
          );
          newTaskToCategory(task);
          successNotyftMessage([`Move task to '${selectedCategory.value}' successfully!`,`已將任務移動到'${selectedCategory.value}'!`]);
        }else{
          targetTask.text = task.text;
          targetTask.date = task.date;
          targetTask.updatetime = Date.now();
          successNotyftMessage(['Edit task successfully!','已修改任務內容!']);
        }
        
        // Reset edit mode
        isEdit.value = false;
        editTask.value = {
          id: '',
          categoryName: '',
          text: '',
          date: setDate(),
          updatetime: Date.now(),
          urgent: false,
          completed: false,
          archive: false,
          opend: false
        };
        
      }

      // 保存到localStorage
      saveToLocalStorage();
  
      task.text = '';
      router.go(0);

    }
  }

  const copyTask = (category, date, text) => {
    navigator.clipboard.writeText(text.trim())
        .then(() => 
          successNotyftMessage(['Copy success task text successfully!','複製成功!'])
        )
        .catch(err => console.error("Copy error!", err));
      selectedCategory.value = category;
      task.value.text = text;
      task.value.date = date;
  };



  return {
    task,
    allTaskCount,
    finishTaskCount,
    urgentTaskCount,
    allTasklist,
    addTaskToCategory,
    finishTask,
    setUrgentTask,
    copyTask,
    // removeTask,
    selectedCategory,
    setUrgentTask,
    setEditTask,
    isEdit,
    editTaskToCategory,
    removeTask,
    setDate,
  };
}
