<template>
    <h1 class="bhutuka-expanded-one-regular"><i class="fa-solid fa-icons"></i> new CATEGORY!</h1>
    <!-- <div v-if="this.selectedCategory" class="selected-category-sub">{{this.selectedCategory}} - sub</div> -->
    <div class="button-container">
    <input type="text" v-model="newCategory" placeholder="Enter a new category..." required>
    <div class="task-menu">
        <i title="As you see is add a new category!" @click="saveCategory" class="font-awesome-i fa-solid fa-paper-plane"></i>
    </div>
    </div>
    <br>
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
                <svg class="vbp-header-menu-button__svg" @click="toggleCategory(category)" :class="{ 'task-opend': expandedCategories.includes(category) }">
                    <line x1="0" y1="50%" x2="100%" y2="50%" class="top" shape-rendering="crispEdges" />
                    <line x1="0" y1="50%" x2="100%" y2="50%" class="middle" shape-rendering="crispEdges" />
                    <line x1="0" y1="50%" x2="100%" y2="50%" class="bottom" shape-rendering="crispEdges" />
                </svg>
                <!-- <i class="font-awesome-i fa-solid fa-bars" @click="toggleCategory(category)"></i> -->
                <ul v-if="isCategoryVisible" v-show="expandedCategories.includes(category)" class="dropdown-menu dropdown-menu-category ">
                    <li @click="archiveCategory(category)" >
                    <i class="font-awesome-i fa-solid fa-boxes-packing"></i><span>|　Archive category</span>
                    </li>
                    <li @click="renameCategory(category)">
                    <i class="font-awesome-i fa-solid fa-pen-to-square"></i><span>|　Rename category</span>
                    </li> 
                    <li @click="viewCategoryArchiveTasklist(category)">
                    <i class="font-awesome-i fa-solid fa-folder-tree"></i><span>|　View archive task list</span>
                    </li> 
                    <li @click.stop="removeCategory(category)">
                    <i class="font-awesome-i fa-solid fa-trash"></i><span>|　Remove category</span>
                    </li> 
                </ul>
                </div>
            </div>
            
        </div>
    </div>
</template>