# zl-indexDB
indexDB操作库---提高indexDb的使用效率

## 安装引入

**script方式**

**import方式**

## 创建或升级indexDB数据库
```js

//------------- 定义数据库信息 -----------------
// indexdb数据库名字
let dbName='taskNotes';
// iddexdb数据库版本
let dbVersion=1;
/*
 数据库对象仓库结构(类似mysql中的数据表集合)
 当开始创建或者打开indexDB数据库时,objectStores 会在升级函数里面执行
 objectStores为数组结构，每个数组元素都代表一个对象仓库（类似于mysql中的table）
*/
let objectStores = [ 
{
    objectStoreName: "notes",//表名
    type: 1, //0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建
    keyMode:  { autoIncrement: true, keyPath: 'recordID' },//设置主键为recordID，且自动递增
    indexs: [ // 创建索引信息
        { indexName: "keyIndex", fieldName: "key", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
        { indexName: "emailIndex", fieldName: "email", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
        { indexName: "doc_typeIndex", fieldName: "doc_type", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
    ]
}, 
{
    objectStoreName: "users",//表名
    type: 1,//0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建
    keyMode: { keyPath: 'keyword' },//设置主键为 keyword
    indexs: [ // 创建索引信息
        { indexName: "keywordIndex", fieldName: "keyword", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
    ]
}
]
//------------- 开始创建或升级数据库 -----------------
window.DB = new IndexDBOpt(dbName, dbVersion, objectStores); //提示：如果数据库版本需要升级，请刷新下页面在执行升级操作
```


## 操作indexDB数据库

```js
(async function () {
//添加数据
//==============创建数据仓库时指定了keypath的模式==============
//添加一条数据(添加的数据中包含了key,或者key会自动生成并自动递增)
let res = await DB.addData(["hello"], { name: "zs", age: 18 });
//添加多条数据(添加的数据中包含了key,或者key会自动生成并自动递增)
let res2 = await DB.addData(["hello"], [
{ name: "zss1", age: 18 }, 
{ name: "zsd2", age: 18 }, 
{ name: "zs3", age: 18 }, 
{ name: "zsf4", age: 20 }
]);
//==============创建数据仓库时没有指定keypath的模式==============
//添加一条数据(需要手动传入指定的key：thekeyName)
let res = await DB.addData(["hello"], { name: "zs", age: 18, thekeyName:"id" });
//添加多条数据(需要手动传入指定的key：thekeyName)
let res2 = await DB.addData(["hello"], [
{ name: "zss1", age: 18, thekeyName:"id1"  }, 
{ name: "zsd2", age: 18, thekeyName:"id2" }, 
{ name: "zs3", age: 18 , thekeyName:"id3" }, 
{ name: "zsf4", age: 20 , thekeyName:"id4" }
]);




//修改数据
//======================主键本身就是数据元素中的一个字段：recordID===========
//修改单条数据
let res3 = await DB.updateData(["hello"], { name: "111", age: 111, recordID: 1 });
//批量修改数据
let res4 = await DB.updateData(["hello"], [
{ name: "zss111111", age: 180, recordID: 21 }, 
{ name: "zss1222222", age: 180, recordID: 22 }, 
{ name: "zss1333333", age: 180, recordID: 23 }
]);
//======================主键为手动指定的字段thekeyName，不存在于数据仓库结构中===========
//修改单条数据
 let res3 = await DB.updateData(["hello"], { name: "111", age: 111, recordID: 1 , thekeyName:1 } );
//批量修改数据
let res4 = await DB.updateData(["hello"], [
{ name: "zss111111", age: 180, recordID: 21 , thekeyName:2 }, 
{ name: "zss1222222", age: 180, recordID: 22 , thekeyName:3 }, 
{ name: "zss1333333", age: 180, recordID: 23 , thekeyName:4 }
]);





//查询数据
// ===========通过keypath向对象仓库（表）查询数据，无参数则查询所有==========
//从hello表中查询主键为5的单条数据
let res9 = await DB.queryBykeypath(['hello'],5)
//从hello表中查询所有数据
let res10 = await DB.queryBykeypath(['hello'])
//=======通过索引index向对象仓库（表）查询数据,不传查询参数就查询所有数据========
//从hello表中查询nameIndex为zs3的单条数据
let res11 = await DB.queryByIndex(['hello'],{name:"nameIndex",value:"zs3",uni:true})
//从hello表中查询ageIndex为18的多条数据
let res12 = await DB.queryByIndex(['hello'],{name:"ageIndex",value:"18"})
//从hello表中查询ageIndex为18的多条数据，然后传入where进一步查询
let res12 = await DB.queryByIndex(['hello'],{name:"ageIndex",value:"18"},[{key:"sex",value:'男',opt:"=="}])





// 删除数据
//删除主键为23的数据
let res5 = await DB.deleteData(["hello"], [23]);
//删除表的所有数据
let res6 = await DB.deleteData(["hello"]);


//关闭数据库链接
//当数据库的链接关闭后，对他的操作就不再有效
let res7 = await DB.close();




//删除数据库
//如果没传参就删除本身数据库，否则删除指定数据库
let res8 = await DB.deleteDataBase();//删除后，可能要刷新下才能看

}())



```
