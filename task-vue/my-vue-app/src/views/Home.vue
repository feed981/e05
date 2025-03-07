<template>
  <h1 class="bhutuka-expanded-one-regular"><i class="fa-solid fa-folder-tree"></i> All Tasklist!</h1>

  <div v-for="(tasks, category) in taskList" :key="category">
    <div class="category" :key="categoryKey">
      <div class="category-name">
        <span title="Can gointo category task list!" @click="viewCategoryTasklist(category)">{{ category }}</span>
        <span v-if="tasks.length === 0">　(No tasks available.)</span>
        <span v-else> 
          　<i title="This category task count!" class="font-awesome-i fa-solid fa-list-check"></i> : {{ tasks.length }}
          , <i title="This category archive task count!" class="font-awesome-i fa-solid fa-boxes-packing"></i> : {{ archivedTaskCount(category) }} 
          , <i title="This category urgent task count!" class="font-awesome-i fa-solid fa-jug-detergent"></i> : {{ urgentTaskCount(category) }}
        </span>
      </div>

      <div class="hamburger-task">
        <div class="dropdown">
          <i class="font-awesome-i fa-solid fa-caret-down" @click="toggleCategory(category)"></i>
        </div>
      </div>
      
    </div>

    <div v-show="expandedCategories.includes(category)" class="category-content">
      <div v-for="(task, index) in sortedTasksDESC(tasks)" :key="index" class="task-item"
        :class="{ 
          'task-completed': task.completed , 
          'task-urgent': task.urgent, 
          'task-archive': task.archive }"
          >
        <span v-if="!task.archive" class="text-content">　{{ task.date }}　{{ task.text }}</span>
        <div v-if="!task.archive" class="hamburger-task">
          <div class="dropdown">
            <svg class="vbp-header-menu-button__svg" @click="toggleTaskbars(category, task.timestamp)" :class="{ 'task-opend': task.opend }">
              <line x1="0" y1="50%" x2="100%" y2="50%" class="top" shape-rendering="crispEdges" />
              <line x1="0" y1="50%" x2="100%" y2="50%" class="middle" shape-rendering="crispEdges" />
              <line x1="0" y1="50%" x2="100%" y2="50%" class="bottom" shape-rendering="crispEdges" />
            </svg>
            <!-- <i class="font-awesome-i fa-solid fa-bars" @click="toggleTaskbars(category, index)"></i> -->
            <ul v-show="dropdownviewTask[index]" class="dropdown-menu dropdown-menu-task">
              <li @click="archiveTask(category, task.timestamp)" >
                <i class="font-awesome-i fa-solid fa-boxes-packing"></i><span>|　Archive task</span>
              </li>
              <li @click="setUrgentTask(category, task.timestamp)">
                <i class="font-awesome-i fa-solid fa-jug-detergent"></i><span>|　Set urgent task</span>
              </li>
              <li @click="editTask(category, task)">
                <i class="font-awesome-i fa-solid fa-pen-to-square"></i><span>|　Edit task</span>
              </li>
              <li @click="checkTask(category, task.timestamp)">
                <i class="font-awesome-i fa-solid fa-flag-checkered"></i><span>|　Finish task</span>
              </li>
              <li @click="copyTask(task.text)">
                <i class="font-awesome-i fa-solid fa-clone"></i><span>|　Copy task text</span>
              </li>
              <li @click="removeTask(category, task.timestamp, task.text)" >
                <i class="font-awesome-i fa-solid fa-trash"></i><span>|　Remove task</span>
              </li>
            </ul>
          </div>
        </div>

      </div><!-- task end -->
    </div>
  </div>
</template>
  