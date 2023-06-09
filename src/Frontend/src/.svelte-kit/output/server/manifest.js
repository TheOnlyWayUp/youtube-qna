export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {"start":"_app/immutable/entry/start.82d0d356.js","app":"_app/immutable/entry/app.3966cfb2.js","imports":["_app/immutable/entry/start.82d0d356.js","_app/immutable/chunks/index.40420d70.js","_app/immutable/chunks/singletons.079a0f1b.js","_app/immutable/chunks/index.2f5893d6.js","_app/immutable/entry/app.3966cfb2.js","_app/immutable/chunks/index.40420d70.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
