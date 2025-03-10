import { useTask } from "@/composables/useTask.js";
import { useCommon } from "@/composables/useCommon.js";
import { useMenuStore } from '@/store/useStore';

const {
  taskList,
} = useTask();

const common = useCommon();
const { 
    getTodayDate,
    windowConfirm,
    successNotyftMessage,
    errorNotyftMessage,
    warningNotyftMessageCheckData,
    playSoundtrack,
} = common;

const html = () => {

    let htmlContent = `

    <!DOCTYPE html>
    <html>
    
    <head>
      <meta charset="UTF-8">
       <title>Export tasklist 2 html</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=BhuTuka+Expanded+One&family=Indie+Flower&family=Metamorphous&family=Smooch+Sans:wght@100..900&family=Vujahday+Script&family=Wire+One&display=swap" rel="stylesheet">
      <link rel="icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon">
      <link rel="shortcut icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
      <style>
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #121212;
                font-family: Arial, sans-serif;
                color: white;
                margin: 0;
                overflow: hidden;
            }
            .export-container {
                width: 80%;
                max-height: 80vh;
                overflow-y: auto;
                padding: 10px;
                scrollbar-width: thin;
                scrollbar-color: #888 #222;
            }
            .export-container::-webkit-scrollbar {
                width: 8px;
            }
            .export-container::-webkit-scrollbar-track {
                background: #222;
            }
            .export-container::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 4px;
            }
            .post {
                background: #222;
                padding: 15px;
                margin: 10px 0;
                border-radius: 10px;
            }
            .user {
                font-weight: bold;
            }
            .time {
                color: gray;
                font-size: 12px;
            }
            .content {
                margin-top: 5px;
            }
    
            .content .completed{
                color: #5a5a5a;
            }
            .actions {
                display: flex;
                gap: 10px;
                margin-top: 10px;
                color: gray;
            }
        </style>
    </head>
    
    <body>
      <div class="export-container">
    `;
    // 整理所有待辦事項到一個陣列
    const allTasks = [];

    // 遍歷每個分類並整理資料
    Object.entries(taskList).forEach(([category, items]) => {
        items.forEach(item => {
            allTasks.push({
                ...item,
                category
            });
        });
    });
    
    // 按日期降序排序
    allTasks.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 按 category 和 date 分組
    const groupedTasks = {};

    // 依類別與日期與完成狀態分組
    allTasks.forEach(task => {
        // 確保 completed 是字串形式的 "true" 或 "false"
        const completedStatus = String(task.completed);

        if (!groupedTasks[task.category]) {
            groupedTasks[task.category] = {};
        }
        if (!groupedTasks[task.category][task.date]) {
            groupedTasks[task.category][task.date] = { true: [], false: [] };
        }

        // 檢查是否存在對應的陣列
        if (!groupedTasks[task.category][task.date][completedStatus]) {
            groupedTasks[task.category][task.date][completedStatus] = [];
        }

        groupedTasks[task.category][task.date][completedStatus].push(task.text);
    });

    // 依照類別與日期排序
    const sortedCategories = Object.keys(groupedTasks).sort(); // 類別排序

    sortedCategories.forEach(category => {
        htmlContent += `<h3 class="">${category}</h3>`;

        // 日期排序（由新到舊）
        const sortedDates = Object.keys(groupedTasks[category]).sort((a, b) => new Date(b) - new Date(a));

        sortedDates.forEach(date => {

            htmlContent += `<div class="post">`;
            htmlContent += `<div class="user"><span class="time">${date}</span></div>`;
            htmlContent += `<div class="content">`;
            // 遍歷 `true`（完成） 和 `false`（未完成）
            Object.keys(groupedTasks[category][date]).forEach(status => {
                let isCompleted = status === "true"; // 轉換為布林值
                let itemClass = isCompleted ? "completed" : "pending"; // 設定不同的 CSS 類別

                groupedTasks[category][date][status].forEach((task, index) => {
                    htmlContent += `<div class="text-content ${itemClass}">${index + 1}. ${task}</div>`;
                });
            });

            htmlContent += `</div>`;
            htmlContent += `</div>`;
        });
    });
        
    htmlContent += `</div></div></body></html>`;
    return htmlContent;

};

const viewopen = (template ,text) => {
    try{
        const newTab = window.open();
        if (newTab) {
            newTab.document.write(template);
            newTab.document.close();
        } else {
            notyf_warning.open({
                type: 'warning',
                message: '請允許彈出視窗以顯示 ${text}!'
            });
        }
    } catch (error) {
        console.error('View failed:', error);
        errorNotyftMessage([`Failed to view ${text} file`,`無法檢視 ${text} 文件`]);
    }
};

const exportfile = (template ,text ,type) => {
    try {
        const blob = new Blob([template], { type: type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `task_${getTodayDate()}.${text}`;
        link.click();
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    } catch (error) {
        console.error('Export failed:', error);
        errorNotyftMessage([`Failed to export ${text} file`,`無法輸出成 ${text} 文件`]);
    }
};

export function useExport() {

    const viewAs = (format) => {
        successNotyftMessage([`Viewing as ${format.toUpperCase()}`,`檢視 ${format.toUpperCase()} 文件`]);
        if(format === 'json'){
            const jsonString = JSON.stringify(taskList, null, 2);
            const template = `${template_s}<pre>${jsonString}</pre>${template_e}`;
            viewopen(template ,format)
        }else if (format === 'html') {
            let htmlContent = html();
            viewopen(htmlContent ,format)
        }
    };

    const exportAs = (format) => {
        successNotyftMessage([`Exporting as ${format.toUpperCase()}`,`輸出成 ${format.toUpperCase()} 格式`]);
        
        if(format === 'json'){
            const jsonString = JSON.stringify(taskList, null, 2);
            exportfile(jsonString ,format , "application/json");

        }else if (format === 'html') {
            let htmlContent = html();
            exportfile(htmlContent ,format , "text/html");
        }
    };

    const resetdata = () => {
        const menuStore = useMenuStore();
        if (windowConfirm([`Are you sure you want to clear all the data ?`,`你確定要刪除所有數據嗎?`])) {
            playSoundtrack(`${store.cloudfrontsoundtrack}matt-hardy-delete-delete-delete.mp3`);
            localStorage.setItem("tasks" ,'{"default":[]}')
            successNotyftMessage([`Deleting data, please wait...`,`刪除數據中請稍後`]);
            
            setTimeout(() => {
                menuStore.toggleBars();
            }, 2000);
    
            setTimeout(() => {
                successNotyftMessage([`Successfully clear permanently...`,`永久刪除所有數據`]);
            }, 4000);
    
            setTimeout(() => {
                window.location.reload();
            }, 10000);
        }
    };

    return {
        viewAs,
        exportAs,
        resetdata,
    };
}