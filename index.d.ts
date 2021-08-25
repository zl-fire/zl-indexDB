export interface objectStore{
    objectStoreName: string,//表名
    type: number, //0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建
    keyMode:  { autoIncrement: boolean,keyPath:string },//为空对象表示：设置主键模式为手动指定（即操作数据时需要手动指定主键）
    indexs: [ // 创建索引信息
        { indexName: string, fieldName: string, only: { unique: boolean } },//索引名，字段名，索引属性值是否唯一
    ]
}
export default IndexDBOperation;
declare class IndexDBOperation {
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
     * let objectStores = [
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
    constructor(dbName: string, dbVersion: number, objectStores: objectStore[]);
    /**
    * @method createObjectStores
    * @for IndexDBOperation
    * @description 创建对象仓库的函数
    * @param  {Object} db  indexDB数据库的对象
    * @param  {Object}  obj 此数据库的 对象仓库（表）相关信息，包含表名，keyMode，索引集合
    * @return {void}  无返回值
    * @author zl-fire 2021/08/17
    * @example
    * db: DB,
    * obj: {
    *     objectStoreName: "notes",//表名
    *     type: 1,//0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建
    *     keyMode:  { autoIncrement: true, keyPath: 'recordID' },//key的模式，使用时直接设置就可
    *     indexs: [
    *         { indexName: "keyIndex", fieldName: "key", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
    *         { indexName: "emailIndex", fieldName: "email", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
    *         { indexName: "doc_typeIndex", fieldName: "doc_type", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
    *     ]
    * }
     */
    createObjectStores(db: any, obj: any): void;
    /**
     * 作用：创建/打开/升级数据库，
     * @method getDB
     * @for IndexDBOperation
     * @description 此方法自动将thid.db赋值为数据库对象
     * @return void
     */
    getDB(): Promise<any>;
    /**
     * 作用：给对象仓库（表）添加数据，可添加一条，也可批量添加多条，
     * @method addData
     * @for IndexDBOperation
     * @param  {Array} stores  数据要插入到那个对象仓库中去,如["hello"]，类型为数组是为了后面好扩展新功能
     * @param  {Object|Array} data  要添加的数据,对象或对象数组
     * @return {boolean} true:添加成功，false：添加失败
     * @author zl-fire 2021/08/17
     * @example
     * //如果版本升级，请下刷新下页面在执行升级操作
     * let DB = new indexDBOperation("testDB4", 1, objectStores);
     *
     * //==============创建数据仓库时指定了keypath的模式==============
     *
     * //添加一条数据(添加的数据中包含了key,或者key会自动生成并自动递增)
     * let res = await DB.addData(["hello"], { name: "zs", age: 18 });
     *
     * //添加多条数据(添加的数据中包含了key,或者key会自动生成并自动递增)
     * let res2 = await DB.addData(["hello"], [
     * { name: "zss1", age: 18 },
     * { name: "zsd2", age: 18 },
     * { name: "zs3", age: 18 },
     * { name: "zsf4", age: 20 }
     * ]);
     *
     * //==============创建数据仓库时没有指定keypath的模式==============
     *
     * //添加一条数据(需要手动传入指定的key)
     * let res = await DB.addData(["hello"], { name: "zs", age: 18, thekeyName:"id" });
     *
     * //添加多条数据添加多条数据(需要手动传入指定的key：thekeyName)
     * let res2 = await DB.addData(["hello"], [
     * { name: "zss1", age: 18, thekeyName:"id1"  },
     * { name: "zsd2", age: 18, thekeyName:"id2" },
     * { name: "zs3", age: 18 , thekeyName:"id3" },
     * { name: "zsf4", age: 20 , thekeyName:"id4" }
     * ]);
     **/
    addData(stores: string[], data: any | Array): boolean;
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
    queryBykeypath(stores: string[], keypath: string): any;
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
    queryByIndex(stores: string[], indexObj: any, where: any[]): Promise<any>;
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
     * //======================主键本身就是数据元素中的一个字段：recordID===========
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
     * //======================主键为手动指定的字段thekeyName，不存在于数据仓库结构中===========
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
    updateData(stores: string[], data: any): boolean;
    /**
     * 作用：删除对象仓库数据，
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
    deleteData(stores: string[], data: number | string | Array): boolean;
    /**
     * 作用：关闭数据链接，
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
    close(): boolean;
    /**
     * 作用：删除数据库，如果没传参就删除本身数据库，否则删除指定数据库
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
    deleteDataBase(name: any): Promise<any>;
}
