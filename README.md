# zl-indexDB
indexDB操作库---提高indexDb的使用效率

```js

// // objectStores 参数结构示例
// let objectStores = [{
//     objectStoreName: "hello",//表名
//     type: 0,//0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建
//     keyMode: { autoIncrement: true, keyPath: 'recordID' },//key的模式，使用时直接设置就可
//     indexs: [
//         { indexName: "nameIndex", fieldName: "name", only: { unique: true } },//索引名，字段名，索引属性值是否唯一
//         { indexName: "ageIndex", fieldName: "age", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
//     ]
// }]
// let DB = new indexDBOperation("testDB4", 1, objectStores); //如果版本升级，请下刷新下页面在执行升级操作

// (async function () {
//     //添加数据
//     let res = await DB.addData(["hello"], { name: "zs", age: 18 });
//     console.log(res);
//     //批量添加数据
//     let res2 = await DB.addData(["hello"], [{ name: "zss1", age: 18 }, { name: "zsd2", age: 18 }, { name: "zs3", age: 18 }, { name: "zsf4", age: 20 }]);
//     console.log(res);
//     //修改单条数据(key本身就是数据元素中的一个字段)
//     let res3 = await DB.updateData(["hello"], { name: "111", age: 111, recordID: 1 });
//     console.log(res);
//     //批量修改数据(key本身就是数据元素中的一个字段)
//     let res4 = await DB.updateData(["hello"], [{ name: "zss111111", age: 180, recordID: 21 }, { name: "zss1222222", age: 180, recordID: 22 }, { name: "zss1333333", age: 180, recordID: 23 }]);
//     console.log(res);
//     //修改单条数据(key是额外自动生成的，即数据记录中无此字段 ，所以操作时需要我们额外传入 autoIncrementKey 表示主键id，)
//     let res31 = await DB.updateData(["hello"], {...{ name: "111", age: 111, recordID: 1}, autoIncrementKey:1} );
//     //修改单条数据(key是自动生成的，数据记录中含有 The_AutoIncrement_Key 字段接收自动的id值 ，操作时需要也需要传入 The_AutoIncrement_Key自动 表示主键id，)
//     let res31 = await DB.updateData(["hello"], {...{ name: "111", age: 111, recordID: 1}, autoIncrementKey:1} );

/**
 * autoIncrementKey 和 The_AutoIncrement_Key自动 的区别是
 * 前则不存在于数据记录中，操作数据表时会删除此字段，而只取其值。
 * 后者存在于数据记录中，操作时不会删除此字段，会一直存在。
 *
 */

//     console.log(res);
//     //删除数据
//     let res5 = await DB.deleteData(["hello"], [23]);
//     console.log(res);
//     //删除表的所有数据
//     let res6 = await DB.deleteData(["hello"]);
//     console.log(res);
//     //关闭数据库链接(当数据库的链接关闭后，对他的操作就不再有效)
//     let res7 = await DB.close();
//     console.log(res);
//     //删除数据库，如果没传参就删除本身数据库，否则删除指定数据库
//     let res8 = await DB.deleteDataBase();//删除后，可能要刷新下才能看到application中indexdb数据库的变化
//     console.log(res);
//     //从hello表中查询主键（keypath）为5的单条数据
//     let res9 = await DB.queryBykeypath(['hello'],5)
//     console.log(res9);
//     //从hello表中查询所有数据
//     let res10 = await DB.queryBykeypath(['hello'])
//     console.log(res10);
//     //从hello表中查询nameIndex为zs3的单条数据
//     let res11 = await DB.queryByIndex(['hello'],{name:"nameIndex",value:"zs3",uni:true})
//     console.log(res11);
//     //从hello表中查询ageIndex为18的多条数据
//     let res12 = await DB.queryByIndex(['hello'],{name:"ageIndex",value:"18"})
//     //从hello表中查询ageIndex为18的多条数据，然后传入where进一步查询
//     let res12 = await DB.queryByIndex(['hello'],{name:"ageIndex",value:"18"},[{key:"sex",value:'男',opt:"=="}])
//     console.log(res12);
// }())






//       当修改时
//     //------当autoIncrementKey字段存在时，表示key是自动递增的，且没有字段与其对应.--------------------------------
//     //------所以我们传入autoIncrementKey值去查找数据，但是由于数据记录本身没有这个key,所以我们在操作数据时会删除这个字段---------------
//     //------如果 The_AutoIncrement_Key 字段存在时，说明我们使用了The_AutoIncrement_Key字段去接收了字段递增的key,且他存在与我们的数据记录中，操作时他需要存在-------

```