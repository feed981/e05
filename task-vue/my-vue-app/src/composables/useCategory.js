import { ref, reactive, watch, toRaw } from "vue";
import { useCommon } from "@/composables/useCommon.js";
import { useRouter } from 'vue-router';

// 定义响应式变量用于存储新分类名称
/// 從 export 搬出來 ，修改 useCategory.js 为单例模式
const isEdit = ref(false);
const newCategoryName = ref('');
const categoryName = ref('');
// const refreshKey = ref(0);

export function useCategory(watchSource = null) {
    const router = useRouter();
    // 初始化 categoryKey
    const categoryKey = ref(Date.now());

    // 创建一个刷新函数
    const refreshCategory = () => {
        categoryKey.value = Date.now(); // 给 ref 赋新值，触发重新渲染
    };

    // 如果提供了监视源，则在其变化时自动刷新
    if (watchSource) {
        watch(watchSource, () => {
            refreshCategory();
        });
    }

    const { 
        successNotyftMessage,
        warningNotyftMessageCheckData,
        windowConfirm,
    } = useCommon();

    // 分类数据结构
    const defaultCategories = reactive({
        // 每个分类是一个键值对，键是分类ID或名称
        "works": {
        // 分类基本信息
        info: {
            name: "works",
            opend: false,
            urgent: false,
            completed: false,
            timestamp: Date.now(),
            updatetime: Date.now(),
        },
        // 该分类下的任务列表
        tasks: [
            {
            id: "task1",
            text: "Finish this task!",
            date: "2025-03-15",
            opend: false,
            urgent: true,
            archive: false,
            completed: false,
            timestamp: Date.now(),
            updatetime: Date.now(),
            },
            // 更多任务...
        ]
        },
        "personal": {
        info: {
            name: "personal",
            opend: true,
            urgent: false,
            completed: false,
            timestamp: Date.now(),
            updatetime: Date.now(),
        },
        tasks: [
            // 任务列表...
        ]
        }
        // 更多分类...
    });

    const storedCategories = localStorage.getItem("categories");
    const categories = reactive(storedCategories ? JSON.parse(storedCategories) : defaultCategories);

        
    // 保存到localStorage
    const saveToLocalStorage = () => {
        localStorage.setItem("categories", JSON.stringify(toRaw(categories)));
    };

    const saveDefaultCategoriesToLocalStorage = () => {
        localStorage.setItem("categories", JSON.stringify(defaultCategories));
    };

    

    const editCategory = (categoryName, newCategoryName) => {
        
        // 创建新的条目
        const updatedCategory = {
            ...categories[categoryName],  // 复制原有数据
            info: {
                ...categories[categoryName].info,  // 复制原有的 info 对象
                name: newCategoryName,  // 更新名称
                updatetime: Date.now()  // 更新时间
            },
            tasks: [...categories[categoryName].tasks]  // 复制所有任务
        };
        
        // 删除旧条目并添加新条目
        delete categories[categoryName];
        categories[newCategoryName] = updatedCategory;

        saveToLocalStorage();
        successNotyftMessage(['Edit category successfully!','已修改類別!']);

         // 重新加载当前路由
         router.go(0); 
        // refreshKey.value++; // 强制组件重新渲染
    };

    const setEditCategory = (name, datetime) => {
        if (!categories[name] && !datetime)  return;
        categoryName.value = name;
        newCategoryName.value = name;
        isEdit.value = true;
    };

    const clearCategoryTasks = (name, datetime) => {
        if (!categories[name] && !datetime)  return;
        if (windowConfirm([`Are you sure you want to clear '${name}' tasks ?`,`你確定要刪除這個類別的所有任務嗎?`])) {
            categories[name].tasks = [];
            saveToLocalStorage();
            successNotyftMessage([`Successfully clear permanently...`,`永久刪除所有數據`]);
            // 重新加载当前路由
            router.go(0); 
        }
    };

    const removeCategory = (name, datetime) => {
        if (!categories[name] && !datetime)  return;
        if (windowConfirm([`Are you sure you want to remove this category ?`,`你確定要刪除這個類別嗎?`])) {
            const taskCount = categories[name]?.tasks?.length || 0;
            
            if(taskCount < 1){
                delete categories[name];
                saveToLocalStorage();
                successNotyftMessage([`Successfully clear permanently...`,`永久刪除所有數據`]);
                // 重新加载当前路由
                // router.go(0); 
            }else if (windowConfirm([`Are you sure you want to remove this category, it has ${taskCount} tasks?`,`你確定要刪除這個類別嗎，裡面還有 ${taskCount} 個任務?`])) {
            
                delete categories[name];
                saveToLocalStorage();
                successNotyftMessage([`Successfully clear permanently...`,`永久刪除所有數據`]);
                // 重新加载当前路由
                // router.go(0); 

            }
        }
    };


    const createCategory = (name) => {
        // name = name.trim();
        if(!name || !name.trim()){
            warningNotyftMessageCheckData([`Please input your category!`,'請輸入類別!']);
            return;
        } 
        if (!categories[name]) {
          categories[name] = {
            info: {
              name: name,
              opend: false,
              urgent: false,
              completed: false,
              timestamp: Date.now(),
              updatetime: Date.now(),
            },
            tasks: []
          };
        }else{
            warningNotyftMessageCheckData(['This category name is repeat!','類別重複!']);
            return;
        }
        newCategoryName.value = '';
        saveToLocalStorage();
        successNotyftMessage(['Add category successfully!','已新增類別!']);
    };

    return {
        // refreshKey,
        categoryName,
        newCategoryName,
        categories,
        createCategory,
        saveToLocalStorage,
        saveDefaultCategoriesToLocalStorage,
        setEditCategory,
        isEdit,
        editCategory,
        clearCategoryTasks,
        removeCategory,
    };
}