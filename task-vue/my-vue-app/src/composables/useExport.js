import { useTask } from "@/composables/useTask.js";
import { useCommon } from "@/composables/useCommon.js";
import { useStore, useMenuStore } from '@/store/useStore';
import { useRouter } from 'vue-router';

const { taskList, } = useTask();
const { domain_soundtrack, } = useStore();

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

const template_s = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Task List Export</title><link rel="icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon"><link rel="shortcut icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon"><style>body{font-family:Arial,sans-serif;background-color:#1e1e1e;padding:20px;display:flex;flex-direction:column;align-items:center;color:#e0e0e0;transition:background .3s,color .3s}.container{width:100%;max-width:600px;display:flex;flex-direction:column;height:90vh}.log-container{flex-grow:1;overflow-y:auto;padding-top:10px}.log-entry{word-wrap: break-word;background:#2c2c2c;padding:15px;margin:10px 0;border-radius:10px;box-shadow:0 2px 5px rgba(0,0,0,.3);border-left:5px solid ;white-space:pre-line;color:#e0e0e0;transition:background .3s,color .3s}.log-title{font-size:18px;font-weight:700;margin-bottom:5px;color:#fff}.timestamp{font-size:14px;font-weight:700;color:#a0a0a0;display:block;margin-top:5px}a{color:#fff}.light-mode a{color:#1e1e1e}.light-mode{background-color:#414242;color:#333;margin-bottom:10px}.light-mode .log-entry{background:#fff;color:#333;border-left:5px solid ;box-shadow:0 2px 5px rgba(0,0,0,.1)}.light-mode .log-title{color:#222}.light-mode .timestamp{color:gray}.switch-container{display:flex;align-items:center;justify-content:center}.switch-label{font-size:16px;margin-left:10px}.switch{position:relative;display:inline-block;width:50px;height:25px}.switch input{opacity:0;width:0;height:0}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:25px}.slider:before{position:absolute;content:"";height:17px;width:17px;left:4px;bottom:4px;background-color:#fff;transition:.4s;border-radius:50%}input:checked+.slider{background-color:#1da1f2}input:checked+.slider:before{transform:translateX(24px)} pre{white-space: pre-wrap; /* 保留換行並自動換行 */ word-wrap: break-word; /* 讓長單詞換行 */}.light-mode pre{color:#fff;}</style></head><body><div id="app" class="container">`;
const template_e = `</div></body></html>`;

export function useExport() {
    const router = useRouter();
    const { 
        windowConfirm,
        successNotyftMessage,
        playSoundtrack,
    } = useCommon();

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
            playSoundtrack(`${domain_soundtrack.value}matt-hardy-delete-delete-delete.mp3`);
            localStorage.setItem("tasks" ,'{"default":[]}')
            successNotyftMessage([`Deleting data, please wait...`,`刪除數據中請稍後`]);
            
            setTimeout(() => {
                menuStore.toggleBars();
            }, 2000);
    
            setTimeout(() => {
                successNotyftMessage([`Successfully clear permanently...`,`永久刪除所有數據`]);
            }, 4000);
    
            setTimeout(() => {
                router.push('/tasks/list');
            }, 10000);
        }
    };

    return {
        viewAs,
        exportAs,
        resetdata,
    };
}