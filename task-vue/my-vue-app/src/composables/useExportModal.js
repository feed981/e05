import { ref, computed } from 'vue';
import { useTask } from "@/composables/useTask.js";
import { useCategory } from "@/composables/useCategory.js";
import { useDate } from "@/composables/useDate.js";
import { useExport } from "@/composables/useExport.js";

const { 
    formatDateTime,
} = useDate();

const {
  selectedCategory,
} = useTask();

const {
  categories,
} = useCategory();

const {
  viewAs,
  exportAs
} = useExport();

// 彈出窗口顯示控制
// const showExportModal = ref(false);

// 時間範圍類型選項
const rangeTypes = [
  { label: 'all', value: 'all' },
  { label: 'year', value: 'year' },
  { label: 'quarter', value: 'quarter' },
  { label: 'month', value: 'month' },
  { label: 'date', value: 'date' }
];

const selectedExport = ref({action:'preview', format:'json', i:'fa-eye', text:'|　Preview JSON'});

const exportOptions = computed(() => {
  return [
    {action:'preview', format:'json', i:'fa-eye', text:'|　Preview JSON'},
    {action:'download', format:'json', i:'fa-file-export', text:'|　Download JSON'},
    // {action:'preview', format:'html', i:'fa-eye', text:'|　Preview HTML1', modal:'1'},
    {action:'preview', format:'html', i:'fa-eye', text:'|　Preview HTML', modal:'2'},
    // {action:'preview', format:'html', i:'fa-eye', text:'|　Preview HTML3', modal:'3'},
    {action:'download', format:'html', i:'fa-file-export', text:'|　Download HTML'},
  ];
});




// 選中的時間範圍類型
const selectedRangeType = ref('month');

// 年份選項 (當前年份往前 5 年)
const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 6; i++) {
    years.push(currentYear - i);
  }
  return years;
});

// 選中的年份 (默認當前年份)
const selectedYear = ref(new Date().getFullYear());

// 選中的月份 (默認當前月份)
const selectedMonth = ref(new Date().getMonth() + 1);

// 選中的季度 (根據當前月份計算當前季度)
const selectedQuarter = ref(Math.ceil((new Date().getMonth() + 1) / 3));

// 日期區間選擇
const today = new Date().toISOString().split('T')[0];
const startDate = ref(today);
const endDate = ref(today);

// 選擇時間範圍類型
function selectRangeType(type) {
  selectedRangeType.value = type;
}



function quartertimeRangeDescription(exportParams){
    let timeRangeDescription = '';
    switch (exportParams.quarter) {
        case 1:
        timeRangeDescription = `${exportParams.year}/01 - 03`;
        break;
        case 2:
        timeRangeDescription = `${exportParams.year}/04 - 06`;
        break;
        case 3:
        timeRangeDescription = `${exportParams.year}/07 - 09`;
        break;
        case 4:
        timeRangeDescription = `${exportParams.year}/10 - 12`;
        break;
    }
    return timeRangeDescription;
}

function convertToHtml1(filteredCategories, exportParams) {
    // 創建時間範圍的描述
    let timeRangeDescription = '';
    switch (exportParams.type) {
      case 'year':
        timeRangeDescription = `${exportParams.year}`;
        break;
      case 'quarter':
        timeRangeDescription = quartertimeRangeDescription(exportParams);
        break;
      case 'month':
        timeRangeDescription = `${exportParams.year}/${exportParams.month < 10 ? '0' + exportParams.month : exportParams.month}`;
        break;
      case 'date':
        timeRangeDescription = `${exportParams.startDate.replaceAll('-','/')} - ${exportParams.endDate.replaceAll('-','/')}`;
        break;
    }

  
    // 獲取當前日期時間作為報表生成時間
    const now = new Date();
    const generatedTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
    // 開始構建 HTML
    let html = `
  <!DOCTYPE html>
  <html lang="zh-TW">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Report - ${timeRangeDescription}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        height: 100vh;
        background-color: #323232;
      }
      h1 {
        text-align: center;
        color: #868b91;
        margin-bottom: 20px;
      }
      .report-info {
        text-align: right;
        color: #7f8c8d;
        font-size: 0.9em;
        margin-bottom: 30px;
      }
      .category {
        margin-bottom: 40px;
      }
      .category-header {
        background-color: #141414;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        margin-bottom: 15px;
        font-size: 1.2em;
        font-weight: bold;
      }
      .category-info {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-bottom: 15px;
        padding: 0 15px;
      }
      .category-info div {
        flex: 1;
        min-width: 200px;
      }
      .category-info label {
        font-weight: bold;
        color: #7f8c8d;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      th, td {
        border: 1px solid #676767;
        padding: 10px;
        text-align: left;
      }
      th {
      color: #efefef;
        background-color: #212121;
      }
      tr:nth-child(even) {
        background-color: #474747;
      }
       th:first-child {
  width: 50%;
}

        .task-normal{
        color: #efefef;
        }
      .task-completed {
        text-decoration: line-through;
        color: #7f8c8d;
      }
      .task-urgent {
        color: #e74c3c;
        font-weight: bold;
      }
      .empty-tasks {
        text-align: center;
        padding: 20px;
        color: #7f8c8d;
        font-style: italic;
      }
    </style>
  </head>
  <body>
    <h1>Task report - ${timeRangeDescription}</h1>
    <div class="report-info">Report generation time: ${generatedTime}</div>
  `;
  
    // 遍歷每個類別
    Object.keys(filteredCategories).forEach(categoryKey => {
      const category = filteredCategories[categoryKey];
      const tasks = category.tasks || [];
      
      html += `
    <div class="category">
      <div class="category-header">${category.info.name}</div>
      <div class="category-info">
        <!--<div><label>Category status:</label> ${category.info.completed ? 'completed' : 'in progress'}</div>
        <div><label>Priority:</label> ${category.info.urgent ? 'urgent' : 'normal'}</div>
        <div><label>Created time:</label> ${new Date(category.info.timestamp).toLocaleString()}</div>
        <div><label>Update time:</label> ${new Date(category.info.updatetime).toLocaleString()}</div>-->
      </div>
  `;
        

              if (tasks.length > 0) {
                  html += `
                <table>
                  <thead>
                    <tr>
                    <th>Task content</th>
                    <th>Date</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <!--<th>Created time</th>-->
                    </tr>
                  </thead>
                  <tbody>
            `;

                  tasks.forEach(task => {
                    // 決定任務的 CSS 類別
                    const taskClass = task.completed ? 'task-completed' : (task.urgent ? 'task-urgent' : 'task-normal');
                    
                    html += `
                    <tr class="${taskClass}">
                    <td>${task.text}</td>
                    <td>${task.date}</td>
                      <td data-task-id="${task.updatetime}" data-date="${task.date}" data-category="${category.info.name}">
                      ${task.completed ? 'completed' : (task.archive ? 'archive' : 'in progress')}
                      </td>
                      <td data-task-id="${task.updatetime}" data-date="${task.date}" data-category="${category.info.name}">
                      ${task.urgent ? 'urgent' : 'normal'}
                      </td>
                      <!--<td>${new Date(task.timestamp).toLocaleString()}</td>-->
                    </tr>
            `;
                  });

                  html += `
                  </tbody>
                </table>
            `;
                } else {
                  html += `
                <div class="empty-tasks">There are no tasks during this time period.</div>
            `;
                }

                html += `
              </div>
            `;
  });

  // 添加頁腳
    html += `
    <div class="report-info">
      <p>${Object.keys(filteredCategories).length} categories of data were exported</p>
    </div>
  </body>
  </html>
  `;
  
    return html;
  }
  

  function convertToHtml2(filteredCategories, exportParams) {
    // 創建時間範圍的描述
    let timeRangeDescription = '';
    switch (exportParams.type) {
      case 'year':
        timeRangeDescription = `${exportParams.year}`;
        break;
      case 'quarter':
        timeRangeDescription = quartertimeRangeDescription(exportParams);
        break;
      case 'month':
        timeRangeDescription = `${exportParams.year}/${exportParams.month < 10 ? '0' + exportParams.month : exportParams.month}`;
        break;
      case 'date':
        timeRangeDescription = `${exportParams.startDate.replaceAll('-','/')} - ${exportParams.endDate.replaceAll('-','/')}`;
        break;
    }

  
    // 獲取當前日期時間作為報表生成時間
    const now = new Date();
    const generatedTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
    // 開始構建 HTML
    let html = `
  <!DOCTYPE html>
  <html lang="zh-TW">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Report - ${timeRangeDescription}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        /*font-family: "BhuTuka Expanded One", serif;*/
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        height: 100vh;
        background-color: #1e1e1e;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #e0e0e0;
        transition: background .3s, color .3s
      }


    body::-webkit-scrollbar {
      display: none;
    }


      h1 {
        text-align: center;
        color: #868b91;
        margin-bottom: 20px;
        font-family: "BhuTuka Expanded One", serif;
      }
      .report-info {
        text-align: right;
        color: #7f8c8d;
        font-size: 0.9em;
        margin-bottom: 30px;
      }
      .category {
        margin-bottom: 40px;
      }
      .category-header {
          text-align: center;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        margin-bottom: 15px;
        font-size: 1.2em;
        font-weight: bold;
      }
      .category-info {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-bottom: 15px;
        padding: 0 15px;
      }
      .category-info div {
        flex: 1;
        min-width: 200px;
      }
      .category-info label {
        font-weight: bold;
        color: #7f8c8d;
      }
     
    .container {
      width: 100%;
      max-width: 600px;
      display: flex;
      flex-direction: column;
      height: 90vh;
    }

    .log-container {
      flex-grow: 1;
      overflow-y: auto;
      padding-top: 10px;
    }

    .log-entry {
      word-wrap: break-word;
      padding: 15px;
      border-radius: 15px;
      
      color: #e0e0e0;
      background: #2C2C2C;
      margin: 10px 0px;
      box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
      transition: background 1s, margin 1s, color .3s
      }
      
      .log-entry:hover {
        background:rgb(58, 58, 58);
        margin: 20px 0px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
        transition: background 1s, margin 1s, color .3s
    }

    .log-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 5px;
      color: #fff
    }

    .timestamp {
      font-size: 14px;
      font-weight: 700;
      color: #a0a0a0;
      display: block;
      margin-top: 5px
    }

    a {
      color: #fff
    }


    pre {
      white-space: pre-wrap;
      /* 保留換行並自動換行 */
      word-wrap: break-word;
      /* 讓長單詞換行 */
    }
        .task-normal{
        color: #efefef;
        }
      .task-completed {
        text-decoration: line-through;
        color: #7f8c8d;
      }
      .task-urgent {
        color: #e74c3c;
        font-weight: bold;
      }
      .empty-tasks {
        text-align: center;
        padding: 20px;
        color: #7f8c8d;
        font-style: italic;
      }
    </style>
  </head>
  <body>
    <h1>Task report - ${timeRangeDescription}</h1>
    <div class="report-info">Report generation time: ${generatedTime}</div>
  `;
  
    // 遍歷每個類別
    Object.keys(filteredCategories).forEach(categoryKey => {
      const category = filteredCategories[categoryKey];
      const tasks = category.tasks || [];
      
      html += `
        <div id="app" class="container">
    <div class="category">
      <div class="category-header">${category.info.name}</div>
  `;
        
  
              if (tasks.length > 0) {

                html += `<div class="log-container">`;

                // 1. 先用 Map 來分組，確保相同日期的任務在同一個 `<div>`
                const groupedTasks = new Map();
                tasks.forEach(task => {
                  if (!groupedTasks.has(task.date)) {
                    groupedTasks.set(task.date, []);
                  }
                  groupedTasks.get(task.date).push(task);
                });

                // 2. 依據日期依次生成 HTML
                groupedTasks.forEach((taskList, date) => {
                  html += `<div class="log-entry"><div class="date-header">${date}</div>`;  // 新的日期區塊
                  taskList.forEach((task, index)=> {
                    // 判斷 CSS 類別
                    const taskClass = task.completed ? 'completed' : (task.urgent ? 'urgent' : 'normal');
                    const taskClass2 = task.completed ? 'task-completed' : (task.urgent ? 'task-urgent' : 'task-normal');

                    html += `
                      <div class="${taskClass2}">
                        <i class="fa-solid ${taskClass === 'completed' ? 'fa-flag-checkered' : 'fa-thumbtack'}"></i>
                        ${index + 1}. ${task.text}
                      </div>
                    `;
                  });
                  html += `</div>`;  // 結束該日期區塊
                });

                html += `</div>`;

              } else {
                  html += `
                <div class="empty-tasks">There are no tasks during this time period.</div>
            `;
                }

                html += `
              </div>
            `;
  });

  // 添加頁腳
    html += `
    <div class="report-info">
      <p>${Object.keys(filteredCategories).length} categories of data were exported</p>
    </div>
  </body>
  </html>
  `;
  
    return html;
  }

  /**
   * 下載 HTML 格式的任務報表
   * @param {string} html - HTML 格式的報表內容
   * @param {string} filename - 下載的文件名
   */
  function downloadHtml(html, filename = `tasks-report-${formatDateTime(Date.now())}.html`) {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }
  
  /**
   * 預覽 HTML 報表內容
   * @param {string} html - HTML 格式的報表內容
   */
  function previewHtml(html) {
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(html);
    previewWindow.document.close();
  }



export function useExportModal() {

  

  // 匯出資料
function exportData(type, format, htmlmodal) {
  // 根據選擇的範圍類型和日期構建匯出參數
  let exportParams = {
    selectedCategories: selectedCategory.value,
    type: selectedRangeType.value,
  };

  switch (selectedRangeType.value) {
    case 'year':
      exportParams.year = selectedYear.value;
      break;
    case 'quarter':
      exportParams.year = selectedYear.value;
      exportParams.quarter = selectedQuarter.value;
      break;
    case 'month':
      exportParams.year = selectedYear.value;
      exportParams.month = selectedMonth.value;
      break;
    case 'date':
      exportParams.startDate = startDate.value;
      exportParams.endDate = endDate.value;
      break;
  }

  console.log('匯出參數：', exportParams);

  // 篩選符合時間範圍的任務
  const filteredData = filterTasksByDateRange(categories, exportParams);
   if(format === 'html'){
    let htmlReport = '';
    //  if(htmlmodal === '1'){
    //    htmlReport = convertToHtml1(filteredData, exportParams);
    //   }else if(htmlmodal === '2'){
        htmlReport = convertToHtml2(filteredData, exportParams);
    // }

    if(type === 'preview'){
      previewHtml(htmlReport);
    }else{
      downloadHtml(htmlReport);
    }
   }else if(format === 'json'){
    console.log('format:',format)
     if(type === 'preview'){
       viewAs(format, filteredData);
     }else {
       exportAs(format, filteredData);
     }
   }

  // 這裡可以調用你的 API 進行資料匯出
  // exportDataApi(exportParams);
  
  // 關閉彈出窗口
  // showExportModal.value = false;
}

function filterTasksByDateRange(categories, exportParams) {
  // 創建一個深拷貝，避免修改原始數據
  const filteredCategories = JSON.parse(JSON.stringify(categories));
  
  // 為不同的時間範圍類型定義過濾函數
  const dateFilters = {
    // 年份過濾
    year: (task) => {
      const taskDate = new Date(task.date);
      return taskDate.getFullYear() === exportParams.year;
    },
    
    // 季度過濾
    quarter: (task) => {
      const taskDate = new Date(task.date);
      const taskYear = taskDate.getFullYear();
      const taskMonth = taskDate.getMonth() + 1;
      const taskQuarter = Math.ceil(taskMonth / 3);
      
      return taskYear === exportParams.year && taskQuarter === exportParams.quarter;
    },
    
    // 月份過濾
    month: (task) => {
      const taskDate = new Date(task.date);
      const taskYear = taskDate.getFullYear();
      const taskMonth = taskDate.getMonth() + 1;
      
      return taskYear === exportParams.year && taskMonth === exportParams.month;
    },
    
    // 日期範圍過濾
    date: (task) => {
      const taskTime = new Date(task.date).getTime();
      const startTime = new Date(exportParams.startDate).getTime();
      const endTime = new Date(exportParams.endDate).getTime();
      
      return taskTime >= startTime && taskTime <= endTime;
    }
  };
  
  // 選擇對應的過濾函數
  const filterFunction = dateFilters[exportParams.type];
  
  if (!filterFunction) {
    console.error('未知的時間範圍類型:', exportParams.type);
    return filteredCategories;
  }
  
  // 如果指定了類別，只保留選定的類別
  if (exportParams.selectedCategories && exportParams.selectedCategories.length > 0) {
    Object.keys(filteredCategories).forEach(categoryKey => {
      if (exportParams.selectedCategories !== categoryKey) {
        delete filteredCategories[categoryKey];
      }
    });
  }

  // 對每個類別的任務進行過濾
  Object.keys(filteredCategories).forEach(categoryKey => {
    const category = filteredCategories[categoryKey];
    if (category.tasks && Array.isArray(category.tasks)) {
      category.tasks = category.tasks.filter(task => {
        // 確保任務具有有效的日期
        return task.date && filterFunction(task);
      });
    }
  });
  
  return filteredCategories;
}


    return {
      rangeTypes,
      selectedExport,
      exportOptions,
      selectedRangeType,
      yearOptions,
      selectedYear,
      selectedMonth,
      selectedQuarter,
      startDate,
      endDate,
      selectRangeType,
      exportData,
    };
}