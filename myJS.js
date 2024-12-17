
// 打开或创建数据库
var request = indexedDB.open('stackDB',3); //myDataBase    
var db;
var storeName='customers3';

// 如果数据库版本变化或首次创建时触发
request.onupgradeneeded = function(event) {
    console.log("没有發現資料庫或版本不一樣....");
    var db = event.target.result;
    // 创建对象存储（表），设置主键为 'id'
    //var objectStore = db.createObjectStore('customers', { keyPath: 'id' });
    var objectStore = db.createObjectStore(storeName, { keyPath:"id" , autoIncrement:true});         
    // 为 'name' 字段创建索引
    objectStore.createIndex('name', 'name', { unique: false });
    objectStore.createIndex('id', 'id', { unique: true });
};

// 打开数据库成功
request.onsuccess = function(event) {
  console.log("開檔成功");   
  db=event.target.result;

  clearTBody();
  creatAthead(); //創建一個表頭
  cursorGetData(db,storeName);
};

request.onerror = function(event) {
    console.error('Database error:', event.target.error);
};

// 插入数据    
function inData(){          
      //var db = event.target.result;

      var transaction = db.transaction([storeName], 'readwrite');
      var objectStore = transaction.objectStore(storeName);

      var inputElement = document.getElementById("stockNo");
      var inputStockName=document.getElementById("stockName");
      var transDate=document.getElementById("transDate");
      var transAmount=document.getElementById("transAmount");
      var stockNum=document.getElementById("stockNum");

      var inputValue = inputElement.value;
      var stockName=inputStockName.value
      var transAmount=transAmount.value;
      var transDate=transDate.value;
      var stockNum=stockNum.value;

      objectStore.add({ stackNo: inputValue , name: stockName,date: transDate, amount:transAmount, stocknum:stockNum  });          

      transaction.oncomplete = function() {
      console.log('已經存入資料!');
      clearTBody();
      //creatAthead(); //創建一個表頭
      cursorGetData(db,storeName);
      };

      transaction.onerror = function(event) {
      console.error('Transaction failed:', event);
      };
}

// 查询数据
function lookUpData()
{    
  var inputElement = document.getElementById("stockNo");
  var indexValue = inputElement.value;      
  if(indexValue=='') {
     inputElement = document.getElementById("stockName");
     indexValue = inputElement.value;      
     indexName='name';
  }    
  else  var indexName='id';
  var store = db.transaction([storeName], "readwrite").objectStore(storeName); // 仓库对象
  var request=store.index(indexName).get(indexValue);  
  //var request=store.get(1);
  
  //console.log(request);
  request.onerror = function () {
    console.log("查詢失敗");
  };
  request.onsuccess = function (even) {
    var result = even.target.result;    
    clearTBody();    
  };   
  cursorGetDataByIndex(db, storeName, indexName, indexValue); 
} 

 /**
 * 通过游标读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 */
 function cursorGetData(db, storeName) {
  let data = [];
  var store = db
    .transaction(storeName, "readwrite") // 事务
    .objectStore(storeName); // 仓库对象
  var request = store.openCursor(); // 指针对象
  // 游标开启成功，逐行读数据
  request.onsuccess = function (e) {
    var cursor = e.target.result;    
    if (cursor) {
      // 必须要检查
      data.push(cursor.value);     
      cursor.continue(); // 遍历了存储对象中的所有内容
    } else {         
      creatTBody(data);      
    }    
  }          
}
function creatTBody(data)
{  
  //var tbody = document.getElementById("stockTbody").getElementsByTagName('tbody')[0];
  var tbody = document.getElementById("stockTbody")

  data.forEach(function(item) {
  //console.log(item);
  var newRow = tbody.insertRow();

  var checkboxCell = newRow.insertCell(0);
  var stock1 = newRow.insertCell(1);
  var stock2 = newRow.insertCell(2);
  var stock3 = newRow.insertCell(3);
  var stock4 = newRow.insertCell(4);
  var stock5 = newRow.insertCell(5);
  var stock6 = newRow.insertCell(6);

  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "checkbox" + (tbody.rows.length);

  var label = document.createElement("label");
  label.appendChild(checkbox);
  //label.appendChild(document.createTextNode("Option " + (tbody.rows.length)));

  checkboxCell.appendChild(label);
  stock1.textContent = item.stackNo;
  stock2.textContent = item.name;
  stock3.textContent = item.date;
  stock4.textContent = item.amount;
  stock5.textContent = item.stocknum;
  stock6.textContent = item.amount*item.stocknum;
  })
} 
function clearTBody() 
{
  //var table=document.getElementById('stockTable');
  //table.innerHTML='';
    var table=document.getElementById('stockTbody');
    table.innerHTML='';
}
function creatAthead()
{    
   var table = document.getElementById("stockTable");   
   var newHeaders = [ "股票代號","股票名稱","交易日期","交易價格","交易股數","交易總價"  ];    
    // 新增每個表頭 
    var headerRow=table.insertRow();
    var checkboxCell=headerRow.insertCell(0);    
    var checkbox=document.createElement('input');
    checkbox.type='checkbox';
    checkbox.name='checkall';
    var label=document.createElement("label");
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode("全選" ));
    checkboxCell.appendChild(label);
    for( var i=1;i<7;i++){
      var cell=headerRow.insertCell(i);
      cell.textContent=newHeaders[i-1];
    }    
}

 /**
 * 通过索引和游标查询记录
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 */
 function cursorGetDataByIndex(db, storeName, indexName, indexValue) {
  let list = [];
  var store = db.transaction(storeName, "readwrite").objectStore(storeName); // 仓库对象
  var request = store
    .index(indexName) // 索引对象
    .openCursor(IDBKeyRange.only(indexValue)); // 指针对象
    
  request.onsuccess = function (e) {
    var cursor = e.target.result;
    list=[];
    if (cursor) {
      // 必须要检查
      list.push(cursor.value);           
      creatTBody(list);
      cursor.continue(); // 遍历了存储对象中的所有内容
    } else {
      console.log("查詢完成");
      //console.log("游标索引查询结果：", list);       
      //creatTBody(list);
    }
  };
  request.onerror = function (e) {};
}

function upData(){
// 更新数据
  //var db = event.target.result;
  var updateTransaction = db.transaction([storeName], 'readwrite');
  var updateObjectStore = updateTransaction.objectStore('customers');

  //var updatedCustomer = { id: '00929', name: '台灣50' };
  var inputElement = document.getElementById("stockNo");
  var inputStockName=document.getElementById("stoackName");
  var inputValue = inputElement.value;
  var stockName=inputStockName.value
  var updatedCustomer={id: inputValue , name: stockName  };   

  updateObjectStore.put(updatedCustomer);

  updateTransaction.oncomplete = function() {
  console.log('Transaction completed: data updated.');
  };
  // 错误处理
  
}


//通過主鍵刪除數據
//主鍵即我們創建資料庫時申明的keyPath，它是唯一的。
//代碼如下：
/**
* 通过主键删除数据
* @param {object} db 数据库实例
* @param {string} storeName 仓库名称
* @param {object} id 主键值
*/
function deleteData(storeName) {
var inputElement = document.getElementById("stockNo");      
var id = inputElement.value;

var request = db
  .transaction([storeName], "readwrite")
  .objectStore(storeName)
  .delete(id);

  request.onsuccess = function () {
    console.log("数据删除成功");
    clearTBody();
    creatAthead(); //創建一個表頭
    cursorGetData(db,storeName);  
  };

  request.onerror = function () {
    console.log("数据删除失败");
  };
}
