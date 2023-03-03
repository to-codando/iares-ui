export type TObject = {
	[key: string]: any;
};

export type THandler = {
	<T>(arg: T): void;
};

export type TListener = {
	[key: string]: THandler[];
};

export type Tsubscriber = {
	eventName: string;
	handler: THandler;
};

export type TEmitter = {
	eventName: string;
	handler: THandler;
};

export type TPubsub = {
	on: (eventName: string, handler: THandler) => Tsubscriber;
	off: ({ eventName, handler }: Tsubscriber) => void;
	emit: <T>(eventName: string, handler: TObject) => void;
};

export type TPubsubFactory = {
	(): TPubsub;
};
