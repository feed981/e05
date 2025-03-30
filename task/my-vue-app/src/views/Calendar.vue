<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTask } from "@/composables/useTask.js";
const { t } = useI18n();

const {
  allTasklist
} = useTask();

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());

const weekDays = computed(() => [
  t('calendar.weekDays.sun'),
  t('calendar.weekDays.mon'),
  t('calendar.weekDays.tue'),
  t('calendar.weekDays.wed'),
  t('calendar.weekDays.thu'),
  t('calendar.weekDays.fri'),
  t('calendar.weekDays.sat')
]);

const monthNames = computed(() => [
  t('calendar.months.january'),
  t('calendar.months.february'),
  t('calendar.months.march'),
  t('calendar.months.april'),
  t('calendar.months.may'),
  t('calendar.months.june'),
  t('calendar.months.july'),
  t('calendar.months.august'),
  t('calendar.months.september'),
  t('calendar.months.october'),
  t('calendar.months.november'),
  t('calendar.months.december')
]);

const firstDay = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const prevMonth = () => {
  currentMonth.value--;
  if (currentMonth.value < 0) {
    currentMonth.value = 11;
    currentYear.value--;
  }
};

const nextMonth = () => {
  currentMonth.value++;
  if (currentMonth.value > 11) {
    currentMonth.value = 0;
    currentYear.value++;
  }
};

const prevYear = () => {
  currentYear.value--;
};

const nextYear = () => {
  currentYear.value++;
};

const isToday = (day) => {
  const now = new Date();
  return (
    currentYear.value === now.getFullYear() &&
    currentMonth.value === now.getMonth() &&
    day === now.getDate()
  );
};

const filteredHasEntry = (day) => {
  const date = formatDate(day);
  const filteredTasks = {};
  for (const [cat, dates] of Object.entries(allTasklist.value)) {
    if (dates[date]) {
      console.log(date, ', dates[date]:', dates[date]);
      return true; // ✅ 找到符合條件的日期後，立即返回 true
    }
  }
  // console.log('filteredTasks:', filteredTasks);
  return false;
}
const calendarKey = computed(() => `${currentYear.value}-${currentMonth.value}`);

// 格式化日期為 YYYY-MM-DD
const formatDate = (day) => {
  const year = currentYear.value;
  const month = String(currentMonth.value + 1).padStart(2, '0');
  const dayStr = String(day).padStart(2, '0');
  return `${year}-${month}-${dayStr}`;
};
</script>

<template>
    <h1 class="bhutuka-expanded-one-regular">
      <i class="fa-solid fa-calendar"></i> {{ t('calendar.title') }}
    </h1>
    <div class="describe">{{ t('calendar.hint') }}</div>

      <div id="calendar-nav">
        <button class="button2" @click="prevYear">{{ t('calendar.navigation.prevYear') }}</button>
        <button class="button2" @click="prevMonth">{{ t('calendar.navigation.prevMonth') }}</button>
        <button class="button2 now">{{ monthNames[currentMonth] }} {{ currentYear }}</button>
        <button class="button2" @click="nextMonth">{{ t('calendar.navigation.nextMonth') }}</button>
        <button class="button2" @click="nextYear">{{ t('calendar.navigation.nextYear') }}</button>
      </div>
  
      <div id="calendar" :key="calendarKey">
        <div v-for="(day, index) in weekDays" :key="'week-' + index" class="day-header">
          {{ day }}
        </div>
        <div v-for="n in firstDay" :key="'empty-' + n" class="empty-day"></div>
        <div v-for="day in daysInMonth" :key="day" class="day" 
        :class="{ 'has-entry': filteredHasEntry(day), 'today': isToday(day) }">
          <router-link :to="{ name: 'v2.tasks.date', params: { date: formatDate(day) }}" class="clean-link">
            {{ day }}
          </router-link>
        </div>
      </div>
</template>

<style scoped>
@import "../assets/styles/calendar.css";
</style>
