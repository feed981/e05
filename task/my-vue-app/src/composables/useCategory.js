import { ref, reactive, watch, toRaw, onMounted } from "vue";
import { useCommon } from "@/composables/useCommon.js";
import { useRouter } from 'vue-router';
import { encryption } from "@/utils/encryption.js";
import { useUserStore } from '@/store/useStore';
// 定义响应式变量用于存储新分类名称
/// 從 export 搬出來 ，修改 useCategory.js 为单例模式
const isEdit = ref(false);
const isClone = ref(false);
const newCategoryName = ref('');
const categoryName = ref('');
const refreshKey = ref(0);

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
        refreshKey.value++;
    };

    const saveDefaultCategoriesToLocalStorage = () => {
        localStorage.setItem("categories", JSON.stringify(defaultCategories));
    };

    const copyCategory = (categoryName, newName) => {
        if(categoryName === newName.trim()){
            warningNotyftMessageCheckData([`Please input your new category name!`,'請輸入新的類別名稱!']);
            return;
        }
        // 创建新的条目
        const updatedCategory = {
            ...categories[categoryName],  // 复制原有数据
            info: {
                ...categories[categoryName].info,  // 复制原有的 info 对象
                name: newName,  // 更新名称
                updatetime: Date.now()  // 更新时间
            },
            tasks: [...categories[categoryName].tasks]  // 复制所有任务
        };
        
        // 删除旧条目并添加新条目
        categories[newName] = updatedCategory;

        saveToLocalStorage();
        successNotyftMessage(['Copy category successfully!','已複製類別!']);
        isClone.value = false;
        newCategoryName.value = '';
        router.push({ name: 'v2.category.tasks', params: { category: newName } });
    };

    const editCategory = (categoryName, newName) => {
        if(categoryName === newName.trim()){
            warningNotyftMessageCheckData([`Please input your new category name!`,'請輸入新的類別名稱!']);
            return;
        }

        // 创建新的条目
        const updatedCategory = {
            ...categories[categoryName],  // 复制原有数据
            info: {
                ...categories[categoryName].info,  // 复制原有的 info 对象
                name: newName,  // 更新名称
                updatetime: Date.now()  // 更新时间
            },
            tasks: [...categories[categoryName].tasks]  // 复制所有任务
        };
        
        // 删除旧条目并添加新条目
        delete categories[categoryName];
        categories[newName] = updatedCategory;

        saveToLocalStorage();
        successNotyftMessage(['Edit category successfully!','已修改類別!']);
        isEdit.value = false;
        newCategoryName.value = '';
        router.push({ name: 'v2.category.tasks', params: { category: newName } });
    };

    const setCopyCategory = (name, datetime) => {
        if (!categories[name] && !datetime)  return;
        categoryName.value = name;
        newCategoryName.value = name;
        isClone.value = true;
        isEdit.value = false;
    };
    
    const setEditCategory = (name, datetime) => {
        if (!categories[name] && !datetime)  return;
        categoryName.value = name;
        newCategoryName.value = name;
        isEdit.value = true;
        isClone.value = false;
    };

    const clearCategoryTasks = (name, datetime) => {
        if (!categories[name] && !datetime)  return;
        if (windowConfirm([`Are you sure you want to clear '${name}' tasks ?`,`你確定要刪除這個類別的所有任務嗎?`])) {
            categories[name].tasks = [];
            saveToLocalStorage();
            successNotyftMessage([`Permanently delete ${name} all tasks.`,`永久刪除這個類別的所有任務`]);
        }
    };




    const removeCategory = (name, datetime) => {
        if (!categories[name] && !datetime)  return;
        if (windowConfirm([`Are you sure you want to remove this category ?`,`你確定要刪除這個類別嗎?`])) {
            const taskCount = categories[name]?.tasks?.length || 0;
            
            if(taskCount < 1){
                delete categories[name];
                saveToLocalStorage();
                successNotyftMessage([`Permanently delete ${name}.`,`永久刪除這個類別`]);
            }else if (windowConfirm([`Are you sure you want to remove this category, it has ${taskCount} tasks?`,`你確定要刪除這個類別嗎，裡面還有 ${taskCount} 個任務?`])) {
                
                delete categories[name];
                saveToLocalStorage();
                successNotyftMessage([`Permanently delete ${name}.`,`永久刪除這個類別`]);

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

    // 保存分類到後端（加密）
    const saveCategories = async () => {
        try {
            const encryptedData = await encryption.encrypt(categories);
            if (encryptedData) {
                const userStore = useUserStore();
                const response = await fetch('http://localhost:64202/api/categories/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userStore.token}`,
                    },
                    body: JSON.stringify({ encryptedData })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to save categories');
                }
            }
        } catch (error) {
            console.error('Error saving categories:', error);
        }
    };

    // 從後端獲取分類（解密）
    const loadCategories = async () => {
        try {
            const response = await fetch('http://localhost:64202/api/categories');
            if (response.ok) {
                const { encryptedData } = await response.json();
                if (encryptedData) {
                    const decryptedData = await fetch('http://localhost:64202/api/encryption/decrypt', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userStore.token}`,
                        },
                        body: JSON.stringify({ encryptedData })
                    }).then(res => res.json());
                    
                    if (decryptedData) {
                        Object.assign(categories, decryptedData);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    // 在組件掛載時加載數據
    // onMounted(() => {
    //     loadCategories();
    // });

    return {
        refreshKey,
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
        setCopyCategory,
        isClone,
        copyCategory,
        saveCategories,
        loadCategories,
    };
}