<script setup>
import { watch } from 'vue';
import { useTask } from "@/composables/useTask.js";
import { useCategory } from "@/composables/useCategory.js";
import { useExportModal } from "@/composables/useExportModal.js";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
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
  <h1 class="bhutuka-expanded-one-regular">
    <i class="fa-solid fa-file-export"></i> {{ t('export.title') }}
  </h1>

  <div class="modal-content">
    <p>{{ t('export.chooseCategory') }}</p>

    <select
      :title="t('export.categoryPlaceholder')"
      class="category-select" 
      v-model="selectedCategory">
      <option value="">{{ t('export.allCategory') }}</option>
      <option v-for="(categoryData, categoryKey) in categories" :key="categoryKey">
        {{ categoryData.info.name }}
      </option>
    </select>

    <div class="hr"></div>

    <p>{{ t('export.chooseDateRange') }}</p>
    
    <div class="modal-body">
      <!-- 時間範圍類型選擇 -->
      <div class="range-type-selector">
        <div 
          v-for="type in rangeTypes" 
          :key="type.value" 
          :class="['range-type-option', { active: selectedRangeType === type.value }]"
          @click="selectRangeType(type.value)"
        >
          {{ t(`export.dateRange.${type.value}`) }}
        </div>
      </div>
      
      <!-- 根據選擇的類型顯示相應的日期選擇器 -->
      <div class="date-selector">
        <!-- 年度選擇 -->
        <div v-if="selectedRangeType === 'year'" class="year-selector">
          <label>{{ t('export.labels.year') }}：</label>
          <select v-model="selectedYear">
            <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        
        <!-- 季度選擇 -->
        <div v-if="selectedRangeType === 'quarter'" class="quarter-selector">
          <div>
            <label>{{ t('export.labels.year') }}：</label>
            <select v-model="selectedYear">
              <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          <div>
            <label>{{ t('export.labels.quarter') }}：</label>
            <select v-model="selectedQuarter">
              <option v-for="quarter in 4" :key="quarter" :value="quarter">{{ quarter }}</option>
            </select>
          </div>
        </div>

        <!-- 月份選擇 -->
        <div v-if="selectedRangeType === 'month'" class="month-selector">
          <div>
            <label>{{ t('export.labels.year') }}：</label>
            <select v-model="selectedYear">
              <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          <div>
            <label>{{ t('export.labels.month') }}：</label>
            <select v-model="selectedMonth">
              <option v-for="month in 12" :key="month" :value="month">{{ month }}</option>
            </select>
          </div>
        </div>
        
        <!-- 具體日期選擇 -->
        <div v-if="selectedRangeType === 'date'" class="date-range-selector">
          <div>
            <label>{{ t('export.labels.startDate') }}：</label>
            <input class="date" type="date" v-model="startDate" :max="endDate" />
          </div>
          <div>
            <label>{{ t('export.labels.endDate') }}：</label>
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
    </div>
  </div>
</template>

<style scoped>
@import "../assets/styles/ExportModal.css";
</style>