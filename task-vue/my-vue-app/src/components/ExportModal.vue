<script setup>
import { ref, computed } from 'vue';
import { useCategory } from "@/composables/useCategory.js";
import { useExport } from "@/composables/useExport.js";
import { useTask } from "@/composables/useTask.js";

const {
  selectedCategory,
} = useTask();

selectedCategory.value = '';

const {
  categories,
} = useCategory();

const {
    viewAs,
    exportAs,
    convertToHtml,
    previewHtml,
    downloadHtml,
} = useExport();


// 彈出窗口顯示控制
// const showExportModal = ref(false);

// 時間範圍類型選項
const rangeTypes = [
  { label: 'all', value: 'all' },
  { label: 'year', value: 'year' },
  { label: 'quarter', value: 'quarter' },
  { label: 'month', value: 'month' },
  { label: 'date', value: 'date' }
];

// 選中的時間範圍類型
const selectedRangeType = ref('month');

// 年份選項 (當前年份往前 5 年)
const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 6; i++) {
    years.push(currentYear - i);
  }
  return years;
});

// 選中的年份 (默認當前年份)
const selectedYear = ref(new Date().getFullYear());

// 選中的月份 (默認當前月份)
const selectedMonth = ref(new Date().getMonth() + 1);

// 選中的季度 (根據當前月份計算當前季度)
const selectedQuarter = ref(Math.ceil((new Date().getMonth() + 1) / 3));

// 日期區間選擇
const today = new Date().toISOString().split('T')[0];
const startDate = ref(today);
const endDate = ref(today);

// 選擇時間範圍類型
function selectRangeType(type) {
  selectedRangeType.value = type;
}

// 匯出資料
function exportData(type, format) {
  // 根據選擇的範圍類型和日期構建匯出參數
  let exportParams = {
    selectedCategories: selectedCategory.value,
    type: selectedRangeType.value,
  };

  switch (selectedRangeType.value) {
    case 'year':
      exportParams.year = selectedYear.value;
      break;
    case 'quarter':
      exportParams.year = selectedYear.value;
      exportParams.quarter = selectedQuarter.value;
      break;
    case 'month':
      exportParams.year = selectedYear.value;
      exportParams.month = selectedMonth.value;
      break;
    case 'date':
      exportParams.startDate = startDate.value;
      exportParams.endDate = endDate.value;
      break;
  }

  console.log('匯出參數：', exportParams);

  // 篩選符合時間範圍的任務
  const filteredData = filterTasksByDateRange(categories, exportParams);
   if(format === 'html'){
    const htmlReport = convertToHtml(filteredData, exportParams);
    if(type === 'preview'){
      previewHtml(htmlReport);
    }else{
      downloadHtml(htmlReport);
    }
   }else if(format === 'json'){
    console.log('format:',format)
     if(type === 'preview'){
       viewAs(format, filteredData);
     }else {
       exportAs(format, filteredData);
     }
   }

  // 這裡可以調用你的 API 進行資料匯出
  // exportDataApi(exportParams);
  
  // 關閉彈出窗口
  // showExportModal.value = false;
}

function filterTasksByDateRange(categories, exportParams) {
  // 創建一個深拷貝，避免修改原始數據
  const filteredCategories = JSON.parse(JSON.stringify(categories));
  
  // 為不同的時間範圍類型定義過濾函數
  const dateFilters = {
    // 年份過濾
    year: (task) => {
      const taskDate = new Date(task.date);
      return taskDate.getFullYear() === exportParams.year;
    },
    
    // 季度過濾
    quarter: (task) => {
      const taskDate = new Date(task.date);
      const taskYear = taskDate.getFullYear();
      const taskMonth = taskDate.getMonth() + 1;
      const taskQuarter = Math.ceil(taskMonth / 3);
      
      return taskYear === exportParams.year && taskQuarter === exportParams.quarter;
    },
    
    // 月份過濾
    month: (task) => {
      const taskDate = new Date(task.date);
      const taskYear = taskDate.getFullYear();
      const taskMonth = taskDate.getMonth() + 1;
      
      return taskYear === exportParams.year && taskMonth === exportParams.month;
    },
    
    // 日期範圍過濾
    date: (task) => {
      const taskTime = new Date(task.date).getTime();
      const startTime = new Date(exportParams.startDate).getTime();
      const endTime = new Date(exportParams.endDate).getTime();
      
      return taskTime >= startTime && taskTime <= endTime;
    }
  };
  
  // 選擇對應的過濾函數
  const filterFunction = dateFilters[exportParams.type];
  
  if (!filterFunction) {
    console.error('未知的時間範圍類型:', exportParams.type);
    return filteredCategories;
  }
  
  // 如果指定了類別，只保留選定的類別
  if (exportParams.selectedCategories && exportParams.selectedCategories.length > 0) {
    Object.keys(filteredCategories).forEach(categoryKey => {
      if (exportParams.selectedCategories !== categoryKey) {
        delete filteredCategories[categoryKey];
      }
    });
  }

  // 對每個類別的任務進行過濾
  Object.keys(filteredCategories).forEach(categoryKey => {
    const category = filteredCategories[categoryKey];
    if (category.tasks && Array.isArray(category.tasks)) {
      category.tasks = category.tasks.filter(task => {
        // 確保任務具有有效的日期
        return task.date && filterFunction(task);
      });
    }
  });
  
  return filteredCategories;
}



</script>

<template>
    <!-- <div> -->
    <!-- 匯出按鈕 -->
    <!-- <div @click="showExportModal = true" >
        <i class="fa-solid fa-file-export"></i>|　Export
    </div> -->
    <!-- <button 
      @click="showExportModal = true" 
      class="export-btn"
    >
      匯出資料
    </button> -->

    <!-- 匯出彈出窗口 -->
    <!-- <div v-if="showExportModal" class="modal-backdrop"> -->
      <h1 class="bhutuka-expanded-one-regular"><i class="fa-solid fa-file-export"></i> export file!</h1>

      
      <div class="modal-content">
        <p>Choose your export category</p>

        <select
          title="You can choose your category for your task, if you don't have one you should add a new category first!"
          class="category-select" v-model="selectedCategory">
          <option value="">All category</option>
          <option v-for="(categoryData, categoryKey) in categories" :key="categoryKey">
            {{ categoryData.info.name }}
          </option>
        </select>

        <div class="hr"></div>

          <p>Choose your export date range</p>
          <!-- <button @click="showExportModal = false" class="close-btn">&times;</button> -->
        
        <div class="modal-body">
          <!-- 時間範圍類型選擇 -->
          <div class="range-type-selector">
            <div 
              v-for="type in rangeTypes" 
              :key="type.value" 
              :class="['range-type-option', { active: selectedRangeType === type.value }]"
              @click="selectRangeType(type.value)"
            >
              {{ type.label }}
            </div>
          </div>
          
          <!-- 根據選擇的類型顯示相應的日期選擇器 -->
          <div class="date-selector">
            <!-- 年度選擇 -->
            <div v-if="selectedRangeType === 'year'" class="year-selector">
                <label>year：</label>
                <select v-model="selectedYear">
                  <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
                </select>
            </div>
            
            <!-- 季度選擇 -->
            <div v-if="selectedRangeType === 'quarter'" class="quarter-selector">
              <div>
                <label>year：</label>
                <select v-model="selectedYear">
                  <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
                </select>
              </div>
              <div>
                <label>quarter：</label>
                <select v-model="selectedQuarter">
                  <option v-for="quarter in 4" :key="quarter" :value="quarter">{{ quarter }}</option>
                </select>
              </div>
            </div>

            <!-- 月份選擇 -->
            <div v-if="selectedRangeType === 'month'" class="month-selector">
              <div>
                <label>year：</label>
                <select v-model="selectedYear">
                  <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
                </select>
              </div>
              <div>
                <label>month：</label>
                <select v-model="selectedMonth">
                  <option v-for="month in 12" :key="month" :value="month">{{ month }}</option>
                </select>
              </div>
            </div>
            
            
            
            <!-- 具體日期選擇 -->
            <div v-if="selectedRangeType === 'date'" class="date-range-selector">
              <div>
                <label>Start Date：</label>
                <input class="date" type="date" v-model="startDate" :max="endDate" />
              </div>
              <div>
                <label>End Date：</label>
                <input class="date" type="date" v-model="endDate" :min="startDate" />
              </div>
            </div>
          </div>
        </div>

        
        <div class="hr"></div>

        <div class="modal-footer">

          <!-- 時間範圍類型選擇 -->
          <div class="range-type-selector2">
            <div @click="exportData('preview','json')" class="range-type-option"><i class="fa-solid fa-eye"></i>|　Preview JSON</div>
            <div @click="exportData('download','json')" class="range-type-option"><i class="fa-solid fa-file-export"></i>|　Download JSON</div>
            <div @click="exportData('preview','html')" class="range-type-option"><i class="fa-solid fa-eye"></i>|　Preview HTML</div>
            <div @click="exportData('download','html')" class="range-type-option"><i class="fa-solid fa-file-export"></i>|　Download HTML</div>
          </div>

          
          <!-- <button @click="showExportModal = false" class="cancel-btn">View as JSON</button> -->
          <!-- <button @click="exportData" class="confirm-btn">View as HTML</button> -->
        </div>
      </div>
    <!-- </div>
  </div> -->
</template>


<style scoped>
.task-container {
  text-align: left;
}

.dropdown-menu li i {
    width: 30px;
    font-size: 15px;
    cursor: pointer;
}


select {
    font-family: "BhuTuka Expanded One", serif;
    border-radius: 5px;
    border: none;
    color: #fff;
    cursor: pointer;
    background: #2b2b2b;
    transition: all 0.5s ease;
}

/* 滑鼠懸停時變化 */
select:hover {
    background-color: #2b2b2b;
    box-shadow: none;
    transition: all 2.8s ease;
}

/* 點擊時的樣式 */
select:focus {
    outline: none;
    transition: all 2.8s ease;
}

/* 下拉選單的箭頭樣式 */
select::-ms-expand {
    display: none;
    /* 隱藏 IE 的箭頭 */
}


.date {
    font-family: "BhuTuka Expanded One", serif;
    font-size: 12px;
    border: 2px;
    border-radius: 5px;
    background-color: #2b2b2b;
    color: #fff;
    cursor: pointer;
    transition: all 0.5s ease;
}

.date:hover {
    background-color: #2b2b2b;
    box-shadow: none;
    transition: all 2.8s ease;
}

.date:focus {
    outline: none;
    transition: all 2.8s ease;
}


.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.light-mode select ,
.light-mode .date ,
.light-mode .modal-content {
  color: #000;
  background-color: #ffffff;
}

.light-mode .modal-header button{
  color: #000;
}

.light-mode  .modal-footer button{
  border: #fff;
  background-color: #ffffff;
  color: #000;
  border-radius: 25px;
  transition: all 0.8s ease;
}

.light-mode  .modal-footer button:hover{
  background-color: #dddddd;
}

.light-mode .range-type-selector {
  color: #fff;
}

.modal-content {
  /* padding: 20px; */
  /* background-color: #292929; */
  /* width: 500px; */
  /* max-width: 90%; */
  border-radius: 8px;
  /* box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; */
  overflow: hidden;
}

.modal-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* border-bottom: 1px solid #eee; */
}


.modal-header button{
  color: #fff;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-body {
  padding: 5px 0px;
}

.modal-body label{
  text-align: left;
}

.range-type-selector {
  display: flex;
  margin-bottom: 20px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ddd;
}



.range-type-option {
  font-family: "BhuTuka Expanded One", serif;
  flex: 1;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;
  user-select: none;
  /* background: #14a6fa; */
  /* box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px; */

}

.range-type-option:not(:last-child) {
  border-right: 1px solid #ddd;
}

.range-type-option:hover {
  background-color: #2483b9;
}

.range-type-option.active {
  background-color: #2483b9;
  color: white;
}

.date-selector {
  margin-top: 20px;
}

.year-selector,
.month-selector,
.quarter-selector,
.date-range-selector {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.month-selector > div,
.quarter-selector > div,
.date-range-selector > div {
  display: flex;
  align-items: center;
  gap: 10px;
}

label {
  min-width: 80px;
}

select, input[type="date"] {
  padding: 8px;
  
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
}

.modal-footer {
  padding: 12px;
  /* display: flex; */
  justify-content: flex-end;
  /* gap: 10px; */
  /* border-top: 1px solid #eee; */
}
.range-type-selector2 {
  border-radius: 15px;
  overflow: hidden;
  /* border: 1px solid #ddd; */
  color: #fff;
}

.range-type-selector2 div{
  text-align: left;
  margin-bottom: 5px;
  border-radius: 15px;
  font-size: 14px;
}
.range-type-selector2 .range-type-option{
  border: 1px #fff solid;
}

.range-type-selector2 div i{
  font-size: 15px;
  width: 30px;
  cursor: pointer;
  margin-left: 35px;
}

.light-mode .range-type-selector .range-type-option{
  color: #cfcfcf;
}

.light-mode .range-type-selector .range-type-option:hover,
.light-mode .range-type-selector .range-type-option.active{
  color: #ffffff;
}



.light-mode .range-type-selector2 .range-type-option{
  border: 1px #999999 solid;
  color: #a8a8a8;
}

.light-mode .range-type-selector2 .range-type-option:hover{
  color: #ffffff;
}

.modal-content .hr{
    background: #4b4a4a;
    height: 1px;
    margin: 12px 0px;
    width: 100%;
}

.light-mode  .modal-content .hr{
    background: #a8a8a8;
    height: 1px;
    margin: 12px 0px;
    width: 100%;
}

</style>