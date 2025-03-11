import { ref, computed, onMounted } from "vue";
import { useTask } from "@/composables/useTask.js";
import { useCommon } from "@/composables/useCommon.js";
import { useRouter } from 'vue-router';

export function useCategory() {
    
    const { 
        successNotyftMessage,
        warningNotyftMessageCheckData,
    } = useCommon();

    const {
        taskList,
    } = useTask();

    const newCategory = ref('');

    const router = useRouter();

    const saveCategory = () => {
        if(taskList.value[newCategory.value]){
            warningNotyftMessageCheckData([`'${newCategory.value}' this category is repeat!`,`'${newCategory.value}' 這個類別重複!`]);
            return;
        }
        
        if (!newCategory.value.trim()) {
            warningNotyftMessageCheckData([`Please input your category name!`,`請輸入你的類別名稱!`]);
            return;
        }

        if (newCategory.value.trim() && !taskList.value[newCategory.value]) {
            taskList.value[newCategory.value] = [];
            newCategory.value = "";
            localStorage.setItem("tasks", JSON.stringify(taskList.value));
            successNotyftMessage(['Add category successfully!','已新增類別!']);
        }
        router.push('/tasks/list');
    };

    return {
        newCategory,
        saveCategory,
    };
}