<template>
     <h1 class="bhutuka-expanded-one-regular"><i class="fa-solid fa-folder-tree"></i> {{viewCategory}}</h1>
        <p v-if="!taskList[viewCategory]">No archive tasks found for this category.</p>
    <div v-for="(task, index) in sortedTasksDESCategory(taskList[viewCategory])" :key="index" class="task-item"
        :class="{  
        'task-archive': !task.archive,
        'category-task-archive': task.archive }"
        >
        <span v-if="task.archive" class="text-content">　{{ task.date }}　{{ task.text }}</span>
        <div v-if="task.archive" class="hamburger-task">
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
            </ul>
        </div>
        </div>
    </div>
</template>