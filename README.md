# zl-indexdb
indexDB操作库---提高indexDb的使用效率

## 安装引入

**script方式**
```js

    <script src="https://cdn.jsdelivr.net/npm/zl-indexdb@1.2.3/index.js"></script>
    let IndexDBOpt=window["zl-indexdb"];

```

**import方式**
```js
   import IndexDBOpt from "zl-indexdb"
```

## 创建indexDB数据库
```js

//-------------------------======  定义数据库信息 =============================
// indexdb数据库名字
let dbName='myTestdb';

// indexdb数据库版本
let dbVersion=1;

//indexdb数据库对象仓库结构(类似mysql中的数据表集合)，objectStores为数组结构，每个数组元素都代表一个对象仓库（类似于mysql中的table）
let objectStores = [ 
{
    objectStoreName: "notes",//表名
    type: 1, //0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建
    keyMode:  { },//为空对象表示：设置主键模式为手动指定（即操作数据时需要手动指定主键）
    indexs: [ // 创建索引信息
        { indexName: "keyIndex", fieldName: "key", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
        { indexName: "emailIndex", fieldName: "email", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
        { indexName: "doc_typeIndex", fieldName: "doc_type", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
    ]
}, 
{
    objectStoreName: "User",//表名
    type: 1,//0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建
    keyMode: { autoIncrement: true,keyPath: 'userId' },//设置主键为 userId ，且自动递增
    indexs: [ // 创建索引信息
        { indexName: "nameIndex", fieldName: "name", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
        { indexName: "ageIndex", fieldName: "age", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
        { indexName: "userIdIndex", fieldName: "userId", only: { unique: true } },//索引名，字段名，索引属性值是否唯一
    ]
}
]
//  ============================= 创建数据库  =============================
window.DB = new IndexDBOpt(dbName, dbVersion, objectStores); //提示：如果数据库版本需要升级，请刷新下页面在执行升级操作

```


## 操作indexDB数据库

```js
(async function () {
//  ============================= 添加数据  =============================
//创建数据仓库时指定了keypath的模式
let res = await DB.addData(["User"], { name: "zs", age: 18 });//添加一条数据(添加的数据中包含了key,或者key会自动生成并自动递增)

let res2 = await DB.addData(["User"], [ //添加多条数据(添加的数据中包含了key,或者key会自动生成并自动递增)
{ name: "zss1", age: 18 }, 
{ name: "zsd2", age: 18 }, 
{ name: "zs3", age: 18 }, 
{ name: "zsf4", age: 20 }
]);

//创建数据仓库时没有指定keypath的模式
let res = await DB.addData(["User"], { name: "zs", age: 18, thekeyName:"id" });//添加一条数据(需要手动传入指定的key：thekeyName)

let res2 = await DB.addData(["User"], [ //添加多条数据(需要手动传入指定的key：thekeyName)
{ name: "zss1", age: 18, thekeyName:"id1"  }, 
{ name: "zsd2", age: 18, thekeyName:"id2" }, 
{ name: "zs3", age: 18 , thekeyName:"id3" }, 
{ name: "zsf4", age: 20 , thekeyName:"id4" }
]);

//  ===========================  修改数据  =====================================
// 主键本身就是数据元素中的一个字段：userId 
let res3 = await DB.updateData(["User"], { name: "111", age: 111, userId: 1 });//修改单条数据

let res4 = await DB.updateData(["User"], [ //批量修改数据
{ name: "zss111111", age: 180, userId: 1 }, 
{ name: "zss1222222", age: 180, userId: 2 }, 
{ name: "zss1333333", age: 180, userId: 3 }
]);

//键为手动指定的字段thekeyName，不存在于数据仓库结构中

 let res3 = await DB.updateData(["User"], { name: "222", age: 222, userId: 2 , thekeyName:"id" } ); //修改单条数据(存在就修改)

 let res3 = await DB.updateData(["User"], { name: "111", age: 111, userId: 1 , thekeyName:1 } ); //修改单条数据（没有时会创建）

 let res4 = await DB.updateData(["User"], [ //批量修改数据
{ name: "zss111111", age: 180, userId: 4 , thekeyName:"id1" }, 
{ name: "zss1222222", age: 180, userId: 5 , thekeyName:"id2" }, 
{ name: "zss1333333", age: 180, userId: 6 , thekeyName:"id3" }
]);

//  ===========================  查询数据  =====================================
// 通过keypath向对象仓库（表）查询数据，无参数则查询所有
let res9 = await DB.queryBykeypath(['User'],5) //从User表中查询主键为5的单条数据
console.log("==res9===",res9);
let res10 = await DB.queryBykeypath(['User']) //从User表中查询所有数据
console.log("==res10===",res10);

//通过索引index向对象仓库（表）查询数据,不传查询参数就查询所有数据
let res11 = await DB.queryByIndex(['User'],{name:"nameIndex",value:"zs3",uni:true}) //从User表中查询nameIndex为zs3的单条数据
console.log("==res11===",res11);
let res12 = await DB.queryByIndex(['User'],{name:"ageIndex",value:18}) //从User表中查询ageIndex为18的多条数据
console.log("==res12===",res12);

//从User表中查询ageIndex为18的多条数据，然后传入where进一步查询
let res13 = await DB.queryByIndex(['User'],{name:"ageIndex",value:18},[{key:"name",value:'zsd2',opt:"=="}])
console.log("==res13===",res13);

//  ===========================  删除数据  =====================================
//删除主键为3的数据
let res5 = await DB.deleteData(["User"], [3]); 
//删除表的所有数据
let res6 = await DB.deleteData(["User"]);

//  ===========================  关闭数据库链接  =====================================
//当数据库的链接关闭后，对他的操作就不再有效
let res7 = await DB.close();

//  ===========================  删除数据库  =====================================
//如果没传参就删除本身数据库，否则删除指定数据库
let res8 = await DB.deleteDataBase();//删除后，可能要刷新下才能看

}())

```

## 各方法详解
```js
     ===========================  构造实例时 new IndexDBOperation()  =====================================
   /**
     * @method getDB
     * @for IndexDBOperation
     * @description 得到IndexDBOperation实例，创建/打开/升级数据库
     * @param  {String} dbName 要创建或打开或升级的数据库名
     * @param  {Number} dbVersion 要创建或打开或升级的数据库版本
     * @param  {Array} objectStores 此数据库的对象仓库（表）信息集合
     * @param  {String} objectStores.objectStoreName  表名
     * @param  {Number} objectStores.type  表示创建数据库或者升级数据库时，这个数据仓库(表)的处理类型（ 0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建）
     * @param  {Object}  objectStores.keyMode  这个表的key的模式，具有两个可选属性：keyPath,autoIncrement,如果都不写那么添加数据时就需要自动手动的指定key
     * @param  {String} objectStores.keyMode.keyPath   表示在添加数据时，从对象类型的值中取一个字段，作为这条记录的键值，如果作为值的对象中不含有此字段，那么就会报错。
     * @param  {Boolean} objectStores.keyMode.autoIncrement   表示自动生成的递增数字作为记录的键值，一般从1开始。
     * @param  {Array} objectStores.indexs  索引数组，每个对象元素都代表了一条设置的索引,{ indexName: "keyIndex", fieldName: "key", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
     * @return  IDBRequest对象
     * @author zl-fire 2021/08/17
     * @example
     * // 初始化时，开始创建或者打开indexDB数据库,objectStores 会在升级函数里面执行
     * let objec tStores = [
     * {
     *     objectStoreName: "notes",//表名
     *     type: 1,//0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建
     *     keyMode:  { autoIncrement: true, keyPath: 'recordID' },//key的模式: 【keyPath: 'recordID' 表示指定recordID为主键】， 【autoIncrement: true 表示设置主键key自动递增（没有指定具体主键的情况下，主键字段名默认为key）】，【两者可以同存，也可以只存在一个，甚至都不存在】
     *         { indexName: "keyIndex", fieldName: "key", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
     *         { indexName: "emailIndex", fieldName: "email", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
     *         { indexName: "doc_typeIndex", fieldName: "doc_type", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
     *     ]
     * },
     * {
     *     objectStoreName: "users",//表名
     *     type: 1,//0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建
     *     keyMode: { keyPath: 'keyword' },//key的模式，使用时直接设置就可
     *     indexs: [
     *         { indexName: "keywordIndex", fieldName: "keyword", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
     *     ]
     * }
     * ]
     * window.DB = new IndexDBOperation("taskNotes", 1, objectStores); //如果版本升级，请刷新下页面在执行升级操作
     */


     ===========================  queryBykeypath 通过keypath向对象仓库（表）查询数据，无参数则查询所有  ==================
    /**
     * @method queryBykeypath
     * @for IndexDBOperation
     * @description 通过keypath向对象仓库（表）查询数据，无参数则查询所有，
     * @param {Array}  stores  对象仓库数组，但是只取第一个对象仓库名
     * @param {String}  keypath  查询条件,keypath
     * @return {Object} 查询结果
     * @author zl-fire 2021/08/17
     * @example
     * //如果版本升级，请下刷新下页面在执行升级操作
     * let DB = new indexDBOperation("testDB4", 1, objectStores);
     *
     * //从hello表中查询主键（keypath）为5的单条数据
     * let res9 = await DB.queryBykeypath(['hello'],5)
     *
     * //从hello表中查询所有数据
     * let res10 = await DB.queryBykeypath(['hello'])
     **/
   
   
     ======================  queryByIndex 通过索引index向对象仓库（表）查询数据,不传查询参数就查询所有数据  ==================
    /**
     * 作用：通过索引index向对象仓库（表）查询数据,不传查询参数就查询所有数据
     * @method queryByIndex
     * @for IndexDBOperation
     * @param {Array} stores 对象仓库数组，但是只取第一个对象仓库名
     * @param {Object} indexObj 查询条件,索引对象，例：{name:"",value:"",uni:true},uni表示索引是否唯一，true唯一，false不唯一
     * @param {Object[]} where 在基于索引查出的数据中进一步筛选。对象数组 [{key,value,opt:"=="},{key,value,opt}] opt为操作符
     * @author zl-fire 2021/08/17
     * @example
     * //如果版本升级，请下刷新下页面在执行升级操作
     * let DB = new indexDBOperation("testDB4", 1, objectStores);
     *
     * //从hello表中查询nameIndex为zs3的单条数据
     * let res11 = await DB.queryByIndex(['hello'],{name:"nameIndex",value:"zs3",uni:true})
     *
     * //从hello表中查询ageIndex为18的多条数据
     * let res12 = await DB.queryByIndex(['hello'],{name:"ageIndex",value:"18"})
     *
     * //从hello表中查询ageIndex为18的多条数据，然后传入where进一步查询
     * let res12 = await DB.queryByIndex(['hello'],{name:"ageIndex",value:"18"},[{key:"sex",value:'男',opt:"=="}])
     **/

     ======================  updateData 修改对象仓库数据，不存在就创建 ==================
    /**
     * 作用：修改对象仓库数据，不存在就创建
     * @method updateData
     * @for IndexDBOperation
     * @param {Array} stores 要修改的对象仓库
     * @param {any} data 要修改的数据
     * @return {boolean}  true:修改成功，false：修改失败
     * @author zl-fire 2021/08/17
     * @example
     * //如果版本升级，请下刷新下页面在执行升级操作
     * let DB = new indexDBOperation("testDB4", 1, objectStores);
     *
     * //-------------------------主键本身就是数据元素中的一个字段：recordID ------------------
     * //修改单条数据
     * let res3 = await DB.updateData(["hello"], { name: "111", age: 111, recordID: 1 });
     *
     * //批量修改数据
     * let res4 = await DB.updateData(["hello"], [
     * { name: "zss111111", age: 180, recordID: 21 },
     * { name: "zss1222222", age: 180, recordID: 22 },
     * { name: "zss1333333", age: 180, recordID: 23 }
     * ]);
     *
     * //--------------------主键为手动指定的字段thekeyName，不存在于数据仓库结构中 ----------------
     *
     * //修改单条数据
     *  let res3 = await DB.updateData(["hello"], { name: "111", age: 111, recordID: 1 , thekeyName:1 } );
     *
     * //批量修改数据
     * let res4 = await DB.updateData(["hello"], [
     * { name: "zss111111", age: 180, recordID: 21 , thekeyName:2 },
     * { name: "zss1222222", age: 180, recordID: 22 , thekeyName:3 },
     * { name: "zss1333333", age: 180, recordID: 23 , thekeyName:4 }
     * ]);
     *
     *
     **/

     ======================  deleteData 删除对象仓库数据 ==================

    /**
     * 作用:删除对象仓库数据，
     * @method deleteData
     * @for IndexDBOperation
     * @param {Array} stores 要删除的对象仓库
     * @param {number|string|Array} data 要删除的数据的key，或者批量key的集合
     * @return {boolean}  true:删除成功，false：删除失败
     * @author zl-fire 2021/08/17
     * @example
     * //如果版本升级，请下刷新下页面在执行升级操作
     * let DB = new indexDBOperation("testDB4", 1, objectStores);
     *
     * //删除主键为23的数据
     * let res5 = await DB.deleteData(["hello"], [23]);
     *
     * //删除表的所有数据
     * let res6 = await DB.deleteData(["hello"]);
     **/

     ======================  close 关闭数据链接 ==================

    /**
     * 作用: 关闭数据链接，
     * @method close
     * @for IndexDBOperation
     * @return {boolean}  true:成功，false：失败
     * @author zl-fire 2021/08/17
     * @example
     * //如果版本升级，请下刷新下页面在执行升级操作
     * let DB = new indexDBOperation("testDB4", 1, objectStores);
     *
     * //关闭数据库链接(当数据库的链接关闭后，对他的操作就不再有效)
     * let res7 = await DB.close();
     **/

     ============  deleteDataBase 删除数据库，如果没传参就删除本身数据库，否则删除指定数据库 ==================

   /**
     * 作用: 删除数据库，如果没传参就删除本身数据库，否则删除指定数据库
     * @method deleteDataBase
     * @for IndexDBOperation
     * @author zl-fire 2021/08/17
     * @example
     * //如果版本升级，请下刷新下页面在执行升级操作
     * let DB = new indexDBOperation("testDB4", 1, objectStores);
     *
     * //删除数据库，如果没传参就删除本身数据库，否则删除指定数据库
     * let res8 = await DB.deleteDataBase();//删除后，可能要刷新下才能看到application中indexdb数据库的变化
     **/

```

## 注意事项说明
1.  当开始创建或者打开indexDB数据库时,objectStores 会在升级函数里面执行
2.  keypath值示例:{autoIncrement: true,keyPath: 'userId'}
    * autoIncrement: true, 表示设置主键自动递增（默认创建主键字段为key）
    * keyPath: 'userId' 显式的指定主键字段为userId
    * keypath为空对象表示：设置主键模式为每次操作数据时都要手动指定（会生成类似于map结构的键值对数据）
    * 两则字段可以都写上，也可以写一个参数，都写上时表示以指定字段为主键，且如果没传入时对其进行自动递增。

3. 手动指定行外主键适合某些一个名字代码一些信息的情况如:config:{...} , 手动指定config为主键，他的值为一个配置对象
4. 自动生成或者指定行内主键则适合类似于mysql那种二维表的那种情况
 