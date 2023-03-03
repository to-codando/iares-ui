export declare type GenericObjectType = {
    [key: string]: any;
};
export declare type HTMType<Ttype = any, Tchildren = any, Tprops = any> = {
    type: Ttype | string;
    children: Tchildren | [];
    props: Tprops | GenericObjectType;
};
