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


.button2 {
  margin: 0px 2px;
  color: white;
  padding: 10px 0px;
  border: none;
  cursor: pointer;
  width: 100%;
  /* margin-top: 10px; */
  /* box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; */
  transition: background-color 0.3s ease, color 0.3s ease;
  font-size: 10px;
  background: #222;
  box-shadow: rgb(8 9 10 / 44%) 3px 3px 6px 0px inset, rgb(29 29 29 / 50%) -3px -3px 6px 1px inset, rgb(43 43 43 / 20%) 0px 0px 10px;
  transition: all 0.8s ease;
  border-radius: 5px;
  font-family: "Unbounded", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
    
}

.button2:hover {
  /* background: #04365e; */
  background: #2b2b2b;
    box-shadow: rgb(12, 12, 12) 1px 1px 10px, rgba(24, 23, 23, 0.13) 3px 3px 1px 1px, rgba(94, 94, 94, 0.2) 0px 0px 10px;
    font-weight: 800;
    padding: 10px;
    transition: all 0.8s ease;
}

#calendar-nav {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

#calendar {
  color: #000;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-top: 10px;
}

.now {
  /* border-radius: 0px 5px 0px 5px; */
  background: #585858;
  padding: 10px;
  /* box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset; */
  box-shadow: rgb(8 9 10 / 44%) 3px 3px 6px 0px inset, rgb(29 29 29 / 50%) -3px -3px 6px 1px inset, rgb(43 43 43 / 20%) 0px 0px 10px;
}

.day-header {
  font-size: 8px;
  padding: 5px;
  background: #222;
  color: #fff;
  cursor: auto;
  text-align: center;
  box-shadow: rgb(8 9 10 / 44%) 3px 3px 6px 0px inset, rgb(29 29 29 / 50%) -3px -3px 6px 1px inset, rgb(43 43 43 / 20%) 0px 0px 10px;
  transition: all 0.8s ease;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
}

.empty-day {
  background-color: #2C2C2C;
  cursor: auto;
}



.day {
  
  font-size: 12px;
  padding: 5px;
  background: #222;
  color: #fff;
  cursor: pointer;
  text-align: center;
  /* border-radius: 5px; */
  /* box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; */
  /* transition: background-color 0.3s ease, color 0.3s ease; */
  box-shadow: rgb(8 9 10 / 44%) 3px 3px 6px 0px inset, rgb(29 29 29 / 50%) -3px -3px 6px 1px inset, rgb(43 43 43 / 20%) 0px 0px 10px;
    transition: all 0.8s ease;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: var(--bg-secondary); */
  /* background: #ddd; */
  border-radius: 50px;
}

.day:hover {
  background: #2b2b2b;
    box-shadow: rgb(12, 12, 12) 1px 1px 10px, rgba(24, 23, 23, 0.13) 3px 3px 1px 1px, rgba(94, 94, 94, 0.2) 0px 0px 10px;
    transition: all 0.8s ease;
}

.today {
  color: #fff;
  background-color: #424242;
  /* box-shadow: rgb(12, 12, 12) 1px 1px 10px, rgba(24, 23, 23, 0.13) 3px 3px 1px 1px, rgba(94, 94, 94, 0.2) 0px 0px 10px; */
  /* box-shadow: rgba(253, 253, 253, 0.4) 0px 0px 0px 1px, rgba(121, 160, 175, 0.65) 0px 0px 6px 5px, rgba(232, 235, 235, 0.08) 0px 1px 0px inset; */
  box-shadow: rgb(255 255 255 / 79%) 0px 0px 0px 1px, rgb(38 38 38 / 65%) 0px 0px 6px 5px, rgb(255 255 255 / 8%) 0px 1px 0px inset;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.today:hover {
  background-color: #424242;
  box-shadow: rgba(197, 216, 238, 0.4) 0px 0px 0px 1px, rgba(121, 160, 175, 0.65) 0px 0px 3px 1px, rgba(232, 235, 235, 0.08) 0px 1px 0px inset;
}

.has-entry {
  background-color: #1287ca;
}



.light-mode .empty-day {
  background-color: #fff;
  cursor: auto;
}

</style> 