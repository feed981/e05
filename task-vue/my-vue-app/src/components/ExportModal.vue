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
@import "../assets/styles/ExportModal.css";
</style>