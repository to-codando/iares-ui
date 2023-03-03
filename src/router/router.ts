import { TRouter, TExecute, TGenericObject } from "./types";
import { eventDrive } from "../render";

export const router: TRouter = ({ routes, context }) => {
	const _routes = routes;
	let _routerElement!: HTMLElement;

	const execute: TExecute = (validator, callback, error) => {
		if (validator()) return callback({ isValid: validator() });

		if (error) {
			const erro = new Error(error().message);
			erro.name = error().name;
			throw erro;
		}
	};

	const _bindListeners = () => {
		window.addEventListener("hashchange", () => {
			const payload: TGenericObject = { status: true };
			eventDrive.emit("ON-DESTROY", payload);
			_mountRouteByHash(null);
		});
	};

	const _setRouterElement = () => {
		const routerElement = context?.querySelector("router-view");

		execute(
			() => !!routerElement,
			() => (_routerElement = routerElement as HTMLElement),
			() => ({
				name: "Router Error",
				message: "Router element (router-view) is not defined and must be.",
			}),
		);
	};

	const _loadMainRoute = () => {
		const mainRoute = _getMainRoute();
		execute(
			() => !!mainRoute?.start,
			() => mainRoute?.start && navigate(mainRoute.start),
			() => ({
				name: "Router Error",
				message: "Start router is not defined and must be.",
			}),
		);
	};

	const _getMainRoute = () => _routes.find((route) => !!route?.start);

	const _getRouteByHash = (hash: string) => {
		return _routes.find((route) => route.regex.test(hash));
	};

	const _getRouteDefault = () => _routes.find((route) => route?.default);

	const _mountRouteByHash = async (hash: string | null) => {
		const hashValue = hash || window.location.hash || "";
		const route = _getRouteByHash(hashValue) || _getRouteDefault();
		_routerElement.innerHTML = "";
		route?.mount({ context: _routerElement });
	};

	const _getHash = () => window.location.hash || null;

	const _hasActiveRoute = () => !!_getHash();

	const navigate = (path: string) => (window.location.hash = path);

	const init = () => {
		_bindListeners();
		_setRouterElement();
		_hasActiveRoute() ? _mountRouteByHash(_getHash()) : _loadMainRoute();
	};

	return { init, navigate };
};
