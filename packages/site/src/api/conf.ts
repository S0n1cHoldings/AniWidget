import openapi from '@elysia/openapi';

export const openapi_conf = openapi({
	documentation: {
		info: {
			title: 'AniWidget API',
			description: `AniWidget API Documentation`,
			version: '1.0.0',
		},
		// components: {
		// 	securitySchemes: {

		// 	},
		// 	schemas: {},
		// },
	},
	scalar: {
		theme: 'deepSpace',
		layout: 'classic',
		showDeveloperTools: 'never',
		hideModels: false,
		defaultOpenAllTags: true,
		customCss: '',
		defaultHttpClient: {
			targetKey: 'js',
			clientKey: 'fetch',
		},
	},
	path: '/docs',
	exclude: {
		paths: ['/api/'],
		staticFile: false,
	},
});
