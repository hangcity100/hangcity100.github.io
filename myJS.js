
// 打开或创建数据库
var request = indexedDB.open('stackDB', 1); //myDataBase    
var db;

// 如果数据库版本变化或首次创建时触发
request.onupgradeneeded = function(event) {
    console.log("没有發現資料庫或版本不一樣....");
    var db = event.target.result;
    // 创建对象存储（表），设置主键为 'id'
    var objectStore = db.createObjectStore('customers', { keyPath: 'id' });
    // 为 'name' 字段创建索引
    objectStore.createIndex('name', 'name', { unique: false });
};

// 打开数据库成功
request.onsuccess = function(event) {
  console.log("開檔成功");   
  db=event.target.result;
};

request.onerror = function(event) {
    console.error('Database error:', event.target.error);
};

// 插入数据    
function inData(){          
      //var db = event.target.result;

      var transaction = db.transaction(['customers'], 'readwrite');
      var objectStore = transaction.objectStore('customers');

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

      objectStore.add({ id: inputValue , name: stockName,date: transDate, amount:transAmount, stocknum:stockNum  });          

      transaction.oncomplete = function() {
      console.log('已經存入資料!');
      };

      transaction.onerror = function(event) {
      console.error('Transaction failed:', event);
      };
}

// 查询数据
function lookUpData()
{    
  var inputElement = document.getElementById("stockName");
  var indexValue = inputElement.value;    
  var storeName='customers';
  var indexName='name';
  var store = db.transaction([storeName], "readwrite").objectStore(storeName); // 仓库对象
  var request=store.index(indexName).get(indexValue);  
  request.onerror = function () {
    console.log("查詣失敗");
  };
  request.onsuccess = function (even) {
    var result = even.target.result;
    console.log("索引查詢結果:", result);
  }; 

  cursorGetData(db,storeName);
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

    //findStock.innerHTML="";

    if (cursor) {
      // 必须要检查
      data.push(cursor.value);     
      cursor.continue(); // 遍历了存储对象中的所有内容
    } else {
      //console.log("游标读取的数据：", data);

      var displayDiv = document.getElementById("findStock");      

      data.forEach(function(item) { 
        var p = document.createElement("p");
         p.textContent =
         " " + item.id + 
         " " + item.name +
         " " + item.date +
         " " + item.amount +
         " " + item.stocknum; 
         //displayDiv.appendChild(p);
                  
      //將資料置入表格中
      var table=document.getElementById('stockTable');
      var newRow=table.insertRow();
      
      var idCell=newRow.insertCell(0);
      var nameCell=newRow.insertCell(1);
      var dateCell=newRow.insertCell(2);
      var amountCell=newRow.insertCell(3);
      var stocknumidCell=newRow.insertCell(4);
      
      idCell.textContent=item.id;
      nameCell.textContent=item.name;
      dateCell.textContent=item.date;
      amountCell.textContent=item.amount;
      stocknumidCell.textContent=item.stocknum;

    }); 

    }    
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
    if (cursor) {
      // 必须要检查
      list.push(cursor.value);
      cursor.continue(); // 遍历了存储对象中的所有内容
    } else {
      console.log("游标索引查询结果：", list);
    }
  };
  request.onerror = function (e) {};
}

function upData(){
// 更新数据
  //var db = event.target.result;
  var updateTransaction = db.transaction(['customers'], 'readwrite');
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
};

request.onerror = function () {
  console.log("数据删除失败");
};
}
