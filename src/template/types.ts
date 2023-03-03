export type GenericObjectType = {
	[key: string]: any;
};

export type HTMType<Ttype = any, Tchildren = any, Tprops = any> = {
	type: Ttype | string;
	children: Tchildren | [];
	props: Tprops | GenericObjectType;
};
