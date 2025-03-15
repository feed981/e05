import { ref, } from "vue";
import { useTask } from "@/composables/useTask.js";
import { useCategory } from "@/composables/useCategory.js";
import { useCommon } from "@/composables/useCommon.js";
import { useDate } from "@/composables/useDate.js";
import { useStore, } from '@/store/useStore';
import { useRouter } from 'vue-router';

const { allTasklist, } = useTask();
const { domain_soundtrack, } = useStore();

const { 
    categories,
    saveDefaultCategoriesToLocalStorage,
} = useCategory();

const { 
    formatDateTime,
} = useDate();

const html = () => {

    let htmlContent = `

    <!DOCTYPE html>
    <html>
    
    <head>
      <meta charset="UTF-8">
       <title>Export tasklist 2 html</title>
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

             .export-container .hr{
    background: #4b4a4a;
    height: 1px;
    margin: 17px 0px;
    width: 100%;
  }
        </style>
    </head>
    
    <body>
      <div class="export-container">
    `;


    // console.log('allTasklist.value:',allTasklist.value);
    

    // Iterate through all categories
    Object.keys(allTasklist.value).forEach(category => {
        htmlContent += `<div class="hr"></div>`;
        htmlContent += `<h3 class="">${category}</h3>`;
        
        // Get all dates for this category
        const dates = Object.keys(allTasklist.value[category]).sort((a, b) => new Date(b) - new Date(a)); // Sort dates in descending order
    
        // Iterate through dates
        dates.forEach(date => {
            htmlContent += `<h4 class="date-header">${date}</h4>`;
            
            // Process completed tasks (true)
            const completedTasks = allTasklist.value[category][date]["true"];
            if (completedTasks && completedTasks.length > 0) {
                // Sort by timestamp
                completedTasks.sort((a, b) => b.updatetime - a.updatetime);
                
                // Iterate through completed tasks
                completedTasks.forEach((taskObj, index) => {
                    htmlContent += `<div class="post">`;
                    htmlContent += `<div class="content">`;
                    htmlContent += `<div class="text-content completed">${index + 1}. ${taskObj.text}</div>`;
                    htmlContent += `</div>`;
                    htmlContent += `</div>`;
                });
            }
            
            // Process pending tasks (false)
            const pendingTasks = allTasklist.value[category][date]["false"];
            if (pendingTasks && pendingTasks.length > 0) {
                // Sort by timestamp
                pendingTasks.sort((a, b) => b.updatetime - a.updatetime);
                
                // Iterate through pending tasks
                pendingTasks.forEach((taskObj, index) => {
                    htmlContent += `<div class="post">`;
                    htmlContent += `<div class="content">`;
                    htmlContent += `<div class="text-content pending">${index + 1}. ${taskObj.text}</div>`;
                    htmlContent += `</div>`;
                    htmlContent += `</div>`;
                });
            }
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
        link.download = `task_${formatDateTime(Date.now())}.${text}`;
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

const isLoading = ref(false); 
const selectedFile = ref(null); // 用來儲存選擇的檔案

export function useExport() {
    const router = useRouter();
    const { 
        windowConfirm,
        successNotyftMessage,
        warningNotyftMessageCheckData,
        errorNotyftMessage,
        playSoundtrack,
    } = useCommon();



    const handleFileChange = (event) => {
        selectedFile.value = event.target.files[0]; // 存入 data
    };

    const handleFileUpload = (type) => {
        const file = selectedFile.value;
        if (!file){
            warningNotyftMessageCheckData([`Please select the file first!`,`請選擇要匯入的檔案!`]);
        }

        const fileName = file.name; // 獲取檔名
        const match = fileName.match(/^task_\d{4}-\d{2}-\d{2} \d{2}_\d{2}_\d{2}.json$/);

        if (!match) {
            errorNotyftMessage([`Failed to import ,please check your file format!`,`可能是檔名或是檔案內容格式有誤!`]);
        }

        const extension = fileName.substring(fileName.lastIndexOf(".") + 1);
        
        // 檔案格式必須為 json
        if (extension !== "json") {
            errorNotyftMessage([`Failed to import ${extension} file!`,`不是 ${extension} 格式的檔案!`]);
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                if(type === 'overwrite'){
                    localStorage.setItem("categories", JSON.stringify(json.categories));
                    successNotyftMessage([`Coverage completed and reorganizing in progress...`,`資料覆蓋已完成，重組中請稍等...`]);
                    isLoading.value = true;
                }else if(type === 'append'){
                    warningNotyftMessageCheckData(['Not Working yet!','這個功能還沒搞!']);
                    // notyf.success("Adding completed Reorganizing in progress...");
                    // this.isLoading = true;
                }
            } catch (error) {
                console.error('Import failed:', error);
                // notyf.error("Failed to import!");
            }
        };
        reader.readAsText(file);

        setTimeout(() => {
            isLoading.value = false;
            router.push('/');
        }, 3000);

    };

    const viewAs = (format) => {
        successNotyftMessage([`Viewing as ${format.toUpperCase()}`,`檢視 ${format.toUpperCase()} 文件`]);
        if(format === 'json'){
            const jsonString = JSON.stringify(categories, null, 2);
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
            const jsonString = JSON.stringify(categories, null, 2);
            exportfile(jsonString ,format , "application/json");

        }else if (format === 'html') {
            let htmlContent = html();
            exportfile(htmlContent ,format , "text/html");
        }
    };

    const resetdata = () => {
        if (windowConfirm([`Are you sure you want to clear all the data ?`,`你確定要刪除所有數據嗎?`])) {
            playSoundtrack(`${domain_soundtrack.value}matt-hardy-delete-delete-delete.mp3`);
            
            saveDefaultCategoriesToLocalStorage();

            successNotyftMessage([`Deleting data, please wait...`,`刪除數據中請稍後`]);
            
            setTimeout(() => {
                successNotyftMessage([`Successfully clear permanently...`,`永久刪除所有數據`]);
            }, 4000);
    
            setTimeout(() => {
                router.push('/');
            }, 10000);
        }
    };

    return {
        handleFileChange,
        handleFileUpload,
        viewAs,
        exportAs,
        resetdata,
    };
}