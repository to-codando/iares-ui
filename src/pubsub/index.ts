import {
	TPubsubFactory,
	TListener,
	TPubsub,
	THandler,
	Tsubscriber,
	TObject,
} from "./types";

export const pubsubFactory: TPubsubFactory = (): TPubsub => {
	const listeners: TListener = {};

	const _handlerExists = (eventName: string, handler: THandler) => {
		return (
			!listeners.hasOwnProperty(eventName) ||
			listeners[eventName].some((subscribedHandler) => {
				return (
					subscribedHandler.toString() === handler.toString() ||
					subscribedHandler.name === handler.name ||
					subscribedHandler === handler
				);
			})
		);
	};

	const on = (eventName: string, handler: THandler): Tsubscriber => {
		if (!eventName) throw new Error("EventName is not defined and must be.");
		if (!handler || typeof handler !== "function")
			throw new Error("Handler is not a function and must be.");

		if (!listeners.hasOwnProperty(eventName)) {
			listeners[eventName] = [handler];
			return { eventName, handler };
		}

		if (_handlerExists(eventName, handler)) {
			const handlerPosition = listeners[eventName].indexOf(handler);
			if (handlerPosition)
				listeners[eventName].splice(handlerPosition, 1, handler);
			return { eventName, handler };
		}

		listeners[eventName].push(handler);
		return { eventName, handler };
	};

	const off = ({ eventName, handler }: Tsubscriber) => {
		if (!listeners.hasOwnProperty(eventName)) return;

		const eventListeners = listeners[eventName].filter((listener) => {
			if (listener !== handler) return listener;
		});

		listeners[eventName] = eventListeners;
	};

	const emit = (eventName: string, payload: TObject) => {
		if (!eventName) throw new Error("EventName is not defined and must be.");

		if (!listeners.hasOwnProperty(eventName)) return;

		listeners[eventName].forEach((handler) => {
			handler(payload);
		});
	};

	return {
		on,
		off,
		emit,
	};
};
