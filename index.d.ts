export default IndexDBOperation;
declare class IndexDBOperation {

    constructor(dbName: string, dbVersion: number, objectStores: any[]);
    dbName: string;
    dbVersion: number;
    objectStores: any[];
    db: any;
    createObjectStores(db: any, obj: any): void;
    getDB(): Promise<any>;
    addData(stores: any[], data: any | Array): boolean;
    queryBykeypath(stores: any[], keypath: string): any;
    queryByIndex(stores: any[], indexObj: any, where: any[]): Promise<any>;
    updateData(stores: any[], data: any): boolean;
    deleteData(stores: any[], data: number | string | Array): boolean;
    close(): boolean;
    deleteDataBase(name: any): Promise<any>;
}
