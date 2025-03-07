<template>
  <h1 class="bhutuka-expanded-one-regular"><i class="fa-solid fa-folder-tree"></i> {{viewCategory}}</h1>
    <p v-if="!taskList[viewCategory]">No tasks found for this category.</p>
  <div v-for="(task, index) in sortedTasksDESCategory(taskList[viewCategory])" :key="index" class="task-item"
    :class="{ 
      'task-completed': !!task.completed, 
      'task-urgent': !!task.urgent, 
      'task-archive': task.archive }"
    >
    <span v-if="!task.archive" class="text-content">　{{ task.date }}　{{ task.text }}</span>
    <div v-if="!task.archive" class="hamburger-task">
      <div class="dropdown">
        <svg class="vbp-header-menu-button__svg" @click="toggleTaskbars(viewCategory, task.timestamp)" :class="{ 'task-opend': task.opend }">
          <line x1="0" y1="50%" x2="100%" y2="50%" class="top" shape-rendering="crispEdges" />
          <line x1="0" y1="50%" x2="100%" y2="50%" class="middle" shape-rendering="crispEdges" />
          <line x1="0" y1="50%" x2="100%" y2="50%" class="bottom" shape-rendering="crispEdges" />
        </svg>
        <ul v-show="dropdownviewTask[index]" class="dropdown-menu dropdown-menu-task">
          <li @click="archiveTask(viewCategory, task.timestamp)" >
            <i class="font-awesome-i fa-solid fa-boxes-packing"></i><span>|　Archive task</span>
          </li>
          <li @click="setUrgentTask(viewCategory, task.timestamp)">
            <i class="font-awesome-i fa-solid fa-jug-detergent"></i><span>|　Set urgent task</span>
          </li>
          <li @click="editTask(viewCategory, task)">
            <i class="font-awesome-i fa-solid fa-pen-to-square"></i><span>|　Edit task</span>
          </li>
          <li @click="checkTask(viewCategory, task.timestamp)">
            <i class="font-awesome-i fa-solid fa-flag-checkered"></i><span>|　Finish task</span>
          </li>
          <li @click="copyTask(task.text)">
            <i class="font-awesome-i fa-solid fa-clone"></i><span>|　Copy task text</span>
          </li>
          <li @click="removeTask(viewCategory, task.timestamp, task.text)" >
            <i class="font-awesome-i fa-solid fa-trash"></i><span>|　Remove task</span>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>