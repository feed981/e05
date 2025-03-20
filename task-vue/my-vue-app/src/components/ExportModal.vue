<script setup>
import { watch } from 'vue';
import { useTask } from "@/composables/useTask.js";
import { useCategory } from "@/composables/useCategory.js";
import { useExportModal } from "@/composables/useExportModal.js";

const {
  selectedCategory,
} = useTask();

selectedCategory.value = '';

const {
  categories,
} = useCategory();


const {
  rangeTypes,
  selectedExport,
  exportOptions,
  selectedRangeType,
  yearOptions,
  selectedYear,
  selectedMonth,
  selectedQuarter,
  startDate,
  endDate,
  selectRangeType,
  exportData,
} = useExportModal();

watch(selectedExport, (newValue) => {
  if (newValue) {
    exportData(newValue.action, newValue.format, newValue.modal);
  }
});




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

          <div class="range-type-selector2">
            <select v-model="selectedExport">
              <option v-for="option in exportOptions" 
                      :key="option.action + option.format" 
                      :value="option"
                      @click="exportData(option.action, option.format, option.modal)">
                 {{ option.text }}
              </option>
            </select>
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