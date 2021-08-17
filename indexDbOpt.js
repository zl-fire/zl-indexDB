
class indexDBOperation {

    /**
     * @method getDB
     * @for indexDBOperation
     * @description 得到indexDBOperation实例，创建/打开/升级数据库
     * @param dbName {String}  要创建或打开或升级的数据库名
     * @param dbVersion {Number}  要创建或打开或升级的数据库版本
     * @param objectStores {Objectl}  此数据库的对象仓库（表）信息集合
     * @param objectStores.objectStoreName {String} 表名
     * @param objectStores.type {Number} 表示创建数据库或者升级数据库时，这个数据仓库(表)的处理类型（ 0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建）
     * @param objectStores.keyMode {Object}  这个表的key的模式，具有两个可选属性：keyPath,autoIncrement,如果都不写那么添加数据时就需要自动手动的指定key 
     * @param objectStores.keyMode.keyPath {String}  表示在添加数据时，从对象类型的值中取一个字段，作为这条记录的键值，如果作为值的对象中不含有此字段，那么就会报错。
     * @param objectStores.keyMode.autoIncrement {Boolean}  表示自动生成的递增数字作为记录的键值，一般从1开始。
     * @param objectStores.indexs {Array} 索引数组，每个对象元素都代表了一条设置的索引,{ indexName: "keyIndex", fieldName: "key", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
     * @return  viod
     * @author zl-fire 2021/08/17
     * @example
     * // 初始化时，开始创建或者打开indexDB数据库,objectStores 会在升级函数里面执行
     * let objectStores = [
     * {
     *     objectStoreName: "notes",//表名
     *     type: 1,//0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建
     *     keyMode:  { autoIncrement: true, keyPath: 'recordID' },//key的模式，使用时直接设置就可
     *     indexs: [
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
     * window.DB = new indexDBOperation("taskNotes", 1, objectStores); //如果版本升级，请刷新下页面在执行升级操作
     */
    constructor(dbName, dbVersion, objectStores) {
        //先检查数据是否传入
        if (!(dbName && dbVersion && objectStores)) {
            console.error("dbName, dbVersion, objectStores参数都为必填项！"); return;
        }
        this.dbName = dbName;
        this.dbVersion = dbVersion;
        this.objectStores = objectStores;
        this.db = null;//数据库默认为null
        this.getDB();//得到数据库对象：this.db = 数据库对象;
    }

    /**
    * 
    * @method createObjectStores
    * @for indexDBOperation
    * @description 创建对象仓库的函数
    * @param db  {Objectl}  indexDB数据库的对象
    * @param obj  {Objectl}  此数据库的 对象仓库（表）相关信息，包含表名，keyMode，索引集合
    * @return {void}  无返回值
    */
    createObjectStores(db, obj) {
        let store = db.createObjectStore(obj.objectStoreName, obj.keyMode);//然后在创建,创建时知道id为键
        if (obj.indexs && obj.indexs instanceof Array) {
            obj.indexs.forEach(ele => {
                store.createIndex(ele.indexName, ele.fieldName, ele.only); //索引名，字段名，索引属性值是否唯一
            })
        }
    }

    /**
     * 作用：创建/打开/升级数据库，
     * @method getDB
     * @for indexDBOperation
     * @description 此方法自动将thid.db赋值为数据库对象
     * @return void-
     */
    async getDB() {
        let { dbName, dbVersion, objectStores } = this;
        let _this = this;
        return new Promise(function (resolve, reject) {
            let request = window.indexedDB.open(dbName, dbVersion);
            request.onerror = function (event) {
                console.log("数据库", dbName, "创建/打开失败！");
                reject({
                    state: false,//失败标识
                    mes: "数据库" + dbName + "创建/打开失败！"
                })
            }
            request.onsuccess = function (event) {
                console.log("数据库", dbName, "创建/打开成功，拿到数据库对象了！");
                _this.db = request.result;
                resolve({
                    state: true,//成功标识
                });
            }
            request.onupgradeneeded = function (event) {
                console.log("数据库", dbName, "版本变化了！");
                let db = event.target.result; //event中包含了数据库对象
                //创建所有指定的表
                objectStores.forEach(obj => {
                    switch (obj.type) {
                        case 0: //表示把已存在的删除，然后重新创建
                            if (db.objectStoreNames.contains(obj.objectStoreName)) {
                                db.deleteObjectStore(obj.objectStoreName);
                            }
                            _this.createObjectStores(db, obj); //开始创建数据
                            break;
                        case 1: //表示如果不存在才重新创建
                            if (!db.objectStoreNames.contains(obj.objectStoreName)) {
                                _this.createObjectStores(db, obj); //开始创建数据
                            }
                            break;
                        case 2: //表示只删除，不再进行重新创建
                            if (db.objectStoreNames.contains(obj.objectStoreName)) {
                                db.deleteObjectStore(obj.objectStoreName);
                            }
                            break;
                    }
                })

            }
        })
    }
    /**
     * 作用：给对象仓库（表）添加数据，可添加一条，也可批量添加多条，
     * @method addData
     * @for indexDBOperation
     * @param {Array} stores 数据要插入到那个对象仓库中去
     * @param {any} data 要添加的数据
     * @param {string} opt 对象仓库的操作方式：readwrite，read,verionchange
     * @return {boolean}  true:添加成功，false：添加失败
     */
    async addData(stores, data) {
        let _this = this;
        return new Promise(async function (resolve) {
            try {
                //先检查数据是否传入
                if (!(stores && data)) {
                    console.error("stores, data，参数都为必填项！"); return;
                }
                //  * 逻辑：先判断数据库是否已经被创建
                if (_this.db === null) {
                    await _this.getDB();
                }
                //创建事物
                let transaction = _this.db.transaction(stores, "readwrite"); //以可读写方式打开事物，该事务跨越stores中的表（object store）
                let store = transaction.objectStore(stores[0]); //获取stores数组的第一个元素对象
                //然后在判断要插入的数据类型：如果是数组，则循环添加插入
                if (data instanceof Array) {
                    let resArr = [];
                    data.forEach(obj => {
                        let res = store.add(obj);
                        res.onsuccess = function (event) {
                            resArr.push('数据添加成功');
                            if (resArr.length == data.length) {
                                resolve(true);
                            }
                        }
                        res.onerror = function (event) {
                            console.error(event);
                            resolve(false);
                        }
                    })

                }
                else {
                    let res = store.add(data);
                    res.onsuccess = function (event) {
                        resolve(true);
                    }
                    res.onerror = function (event) {
                        resolve(false);
                        console.error(event)
                    }
                }
            }
            catch (err) {
                resolve(false);
                console.error(err)
            }
        })
    }

    /**
     * @method queryBykeypath
     * @for indexDBOperation
     * @description 通过keypath向对象仓库（表）查询数据，无参数则查询所有，
     * @param stores {Array}  对象仓库数组，但是只取第一个对象仓库名
     * @param keypath {String}  查询条件,keypath
     * @return  boolean---rue:成功，false：失败
     */
    async queryBykeypath(stores, keypath) {
        let _this = this;
        return new Promise(async function (resolve) {
            try {
                //先检查数据是否传入
                if (!stores) {
                    console.error("stores参数为必填项！"); return;
                }
                //  * 逻辑：先判断数据库是否已经被创建
                if (_this.db === null) {
                    await _this.getDB();
                }
                var transaction = _this.db.transaction(stores, 'readwrite');
                var store = transaction.objectStore(stores[0]);
                if (keypath) {//查询单条数据
                    //从stores[0]表中通过keypath查询数据 
                    var request = store.get(keypath);
                    request.onsuccess = function (e) {
                        var value = e.target.result;
                        resolve(value);
                    };
                }
                else {  //查询所有数据
                    let arr = [];
                    store.openCursor().onsuccess = function (event) {
                        var cursor = event.target.result; //游标：指向表第一条数据的指针
                        if (cursor) {
                            arr.push(cursor.value)
                            cursor.continue();
                        } else {
                            // console.log('没有更多数据了！');
                            resolve(arr);
                        }
                    };
                }

            }
            catch (err) {
                resolve(false);
                console.error(err)
            }
        })
    }

    /**
     * 作用：通过索引index向对象仓库（表）查询数据,不传查询参数就查询所有数据
     * @method queryByIndex
     * @for indexDBOperation
     * @param {Array} stores 对象仓库数组，但是只取第一个对象仓库名
     * @param {Object} indexObj 查询条件,索引对象，例：{name:"",value:"",uni:true},uni表示索引是否唯一，true唯一，false不唯一
     * @param {Object[]} where 在基于索引查出的数据中进一步筛选。对象数组 [{key,value,opt:"=="},{key,value,opt}] opt为操作符
     * @return {boolean}  true:成功，false：失败
     */
    async queryByIndex(stores, indexObj, where) {
        let _this = this;
        return new Promise(async function (resolve) {
            try {
                //先检查数据是否传入
                if (!stores) {
                    console.error("stores参数为必填项！"); return;
                }
                //  * 逻辑：先判断数据库是否已经被创建
                if (_this.db === null) {
                    await _this.getDB();
                }
                var transaction = _this.db.transaction(stores, 'readwrite');
                var store = transaction.objectStore(stores[0]);
                if (indexObj) {//按索引查询数据
                    // 如果索引时唯一的
                    if (indexObj.uni) {
                        var index = store.index(indexObj.name);
                        index.get(indexObj.value).onsuccess = function (e) {
                            var v = e.target.result;
                            resolve(v);
                        }
                    }
                    // 如果索引是不唯一的
                    else {
                        let arr = [];
                        var index = store.index(indexObj.name);
                        var request = index.openCursor(IDBKeyRange.only(indexObj.value))
                        request.onsuccess = function (e) {
                            var cursor = e.target.result;
                            if (cursor) {
                                var v = cursor.value;
                                arr.push(v)
                                cursor.continue();
                            }
                            else {
                                // 如果还需要进一步筛选(全部为且操作)
                                if (where) {
                                    let arr1 = arr.filter(ele => {
                                        let flag = true;
                                        // 只要有一个条件不符合，此条数据就过滤掉
                                        for (let i = 0; i < where.length; i++) {
                                            let filterObj = where[i];
                                            let val = ele[filterObj.key];
                                            if (!val) val = "";
                                            if (typeof val == 'string') val = val.trim();
                                            switch (filterObj.opt) {
                                                case "==":
                                                    flag = (val == filterObj.value);
                                                    break;
                                                case "===":
                                                    flag = (val === filterObj.value);
                                                    break;
                                                case "<":
                                                    flag = (val < filterObj.value);
                                                    break;
                                                case "<=":
                                                    flag = (val <= filterObj.value);
                                                    break;
                                                case ">":
                                                    flag = (val > filterObj.value);
                                                    break;
                                                case ">=":
                                                    flag = (val >= filterObj.value);
                                                    break;
                                                case "!=":
                                                    flag = (val != filterObj.value);
                                                    break;
                                                case "!==":
                                                    flag = (val !== filterObj.value);
                                                    break;
                                                case "include": //包含操作
                                                    flag = (val.includes(filterObj.value));
                                                    break;
                                                default: break;
                                            }
                                            if (!flag) {
                                                break;
                                            }
                                        }
                                        return flag;
                                    })
                                    resolve(arr1);
                                }
                                else resolve(arr);
                            }
                        }
                    }
                }
                else {  //查询所有数据
                    let arr = [];
                    store.openCursor().onsuccess = function (event) {
                        var cursor = event.target.result; //游标：指向表第一条数据的指针
                        if (cursor) {
                            arr.push(cursor.value)
                            cursor.continue();
                        } else {
                            // console.log('没有更多数据了！');
                            resolve(arr);
                        }
                    };
                }

            }
            catch (err) {
                resolve(false);
                console.error(err)
            }
        })
    }

    /**
     * 作用：修改对象仓库数据，不存在就创建
     * @method updateData
     * @for indexDBOperation
     * @param {Array} stores 要修改的对象仓库
     * @param {any} data 要修改的数据
     * @return {boolean}  true:修改成功，false：修改失败
     */
    async updateData(stores, data) {
        let _this = this;
        return new Promise(async function (resolve, reject) {
            try {
                //先检查数据是否传入
                if (!(stores && data)) {
                    console.error("stores, data，参数都为必填项！"); return;
                }
                //  * 逻辑：先判断数据库是否已经被创建
                if (_this.db === null) {
                    await _this.getDB();
                }
                //创建事物
                let transaction = _this.db.transaction(stores, "readwrite"); //以可读写方式打开事物，该事务跨越stores中的表（object store）
                let store = transaction.objectStore(stores[0]); //获取stores数组的第一个元素对象
                //然后在判断要插入的数据类型：如果是数组，则循环添加插入
                if (data instanceof Array) {
                    let resArr = [];
                    data.forEach(obj => {
                        let res;
                        // 如果数据是使用autoIncrement字段递增的key,那么修改时就需要接收此key
                        if (obj.autoIncrementKey) {
                            let key = obj.autoIncrementKey;
                            delete obj.autoIncrementKey;
                            res = store.put(obj, key);
                        }
                        else {
                            res = store.put(obj);
                        }
                        res.onsuccess = function (event) {
                            resArr.push('数据更新成功');
                            if (resArr.length == data.length) {
                                resolve(true);
                            }
                        }
                        res.onerror = function (event) {
                            resolve(false);
                            console.error(event);

                        }
                    })

                }
                else {
                    let res;
                    let obj = data;
                    // 如果数据时使用autoIncrement字段递增的key,那么修改时就需要接收此key
                    if (obj.autoIncrementKey) {
                        let key = obj.autoIncrementKey;
                        delete obj.autoIncrementKey;
                        res = store.put(obj, key);
                    }
                    else {
                        res = store.put(obj);
                    }
                    res.onsuccess = function (event) {
                        resolve(true);
                    }
                    res.onerror = function (event) {
                        resolve(false);
                        console.error(event);
                    }
                }
            }
            catch (err) {
                resolve(false);
                console.error(err)
            }
        })

    }

    /**
     * 作用：删除对象仓库数据，
     * @method deleteData
     * @for indexDBOperation
     * @param {Array} stores 要删除的对象仓库
     * @param {number|string|Array} data 要删除的数据的key，或者批量key的集合
     * @return {boolean}  true:删除成功，false：删除失败
     */
    async deleteData(stores, data) {
        let _this = this;
        return new Promise(async function (resolve, reject) {
            try {
                //先检查数据是否传入
                if (!stores) {
                    console.error("stores参数为必填项！"); return;
                }
                //  * 逻辑：先判断数据库是否已经被创建
                if (_this.db === null) {
                    await _this.getDB();
                }
                //创建事物
                let transaction = _this.db.transaction(stores, "readwrite"); //以可读写方式打开事物，该事务跨越stores中的表（object store）
                let store = transaction.objectStore(stores[0]); //获取stores数组的第一个元素对象
                //如果未传入data参数，则删除此对象仓库所有的数据
                if (!data) {
                    store.clear();
                }
                //如果是数组，则循环删除
                else if (data instanceof Array) {
                    let resArr = [];
                    data.forEach(obj => {
                        let res = store.delete(obj);
                        res.onsuccess = function (event) {
                            resArr.push('数据删除成功');
                            if (resArr.length == data.length) {
                                resolve(true);
                            }
                        }
                        res.onerror = function (event) {
                            resolve(false);
                            console.error(event);

                        }
                    })

                }
                //如果是单个值，直接删除
                else {
                    let res = store.delete(data);
                    res.onsuccess = function (event) {
                        resolve(true);
                    }
                    res.onerror = function (event) {
                        resolve(false);
                        console.error(event);
                    }
                }
            }
            catch (err) {
                resolve(false);
                console.error(err)
            }
        })

    }
    /**
     * 作用：关闭数据链接，
     * @method close
     * @for indexDBOperation
     * @return {boolean}  true:成功，false：失败
     */
    async close() {
        let _this = this;
        return new Promise(async function (resolve, reject) {
            try {
                //  * 逻辑：先判断数据库是否已经被创建
                if (_this.db === null) {
                    await _this.getDB();
                }
                _this.db.close();
            }
            catch (err) {
                resolve(false);
                console.error(err)
            }
        })
    }
    /**
     * 作用：删除数据库，如果没传参就删除本身数据库，否则删除指定数据库
     * @method deleteDataBase
     * @for indexDBOperation
     * @return {boolean}  true:成功，false：失败
     */
    async deleteDataBase(name) {
        name = name ? name : this.dbName;
        let _this = this;
        return new Promise(async function (resolve, reject) {
            try {

                window.indexedDB.deleteDatabase(name);
                resolve(true);
            }
            catch (err) {
                resolve(false);
                console.error(err)
            }
        })

    }
}
