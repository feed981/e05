import { ref, reactive, watch, toRaw } from "vue";
import { useCommon } from "@/composables/useCommon.js";

export function useCategory(watchSource = null) {


    // 定义响应式变量用于存储新分类名称
    const newCategoryName = ref('');

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
    } = useCommon();

    // 保存到localStorage
    const saveToLocalStorage = () => {
        localStorage.setItem("categories", JSON.stringify(toRaw(categories)));
    };

    const saveDefaultCategoriesToLocalStorage = () => {
        localStorage.setItem("categories", JSON.stringify(defaultCategories));
    };

    const createCategory = (name) => {
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

    const storedCategories = localStorage.getItem("categories");
    const categories = reactive(storedCategories ? JSON.parse(storedCategories) : defaultCategories);

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
            text: "Finish the report!",
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

    return {
        newCategoryName,
        categories,
        createCategory,
        saveToLocalStorage,
        saveDefaultCategoriesToLocalStorage,
    };
}