// 初始化时，开始创建或者打开indexDB数据库,objectStores 会在升级函数里面执行
let objectStores = [{
    objectStoreName: "notes",//表名
    type: 1,//0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建
    keyMode: { keyPath: 'key', },//key的模式，使用时直接设置就可
    indexs: [
        { indexName: "keyIndex", fieldName: "key", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
        { indexName: "emailIndex", fieldName: "email", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
        { indexName: "doc_typeIndex", fieldName: "doc_type", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
    ]
}, {
    objectStoreName: "users",//表名
    type: 1,//0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建
    keyMode: { keyPath: 'keyword' },//key的模式，使用时直接设置就可
    indexs: [
        { indexName: "keywordIndex", fieldName: "keyword", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
    ]
}]
window.DB = new indexDBOperation("taskNotes", 1, objectStores); //如果版本升级，请刷新下页面在执行升级操作