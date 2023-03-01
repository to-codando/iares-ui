export declare type GenericObjectType = {
    [key: string]: any;
};
export declare type HTMType<Ttype = void, Tchildren = void, Tprops = void> = {
    type: Ttype | any;
    children: Tchildren | any[];
    props: Tprops | any;
};
