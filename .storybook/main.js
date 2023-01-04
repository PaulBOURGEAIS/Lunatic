const path = require('path');
const { config } = require('process');

module.exports = {
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	reactOptions: {
		legacyRootApi: false,
	},
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-a11y',
	],
	framework: '@storybook/react',
	core: {
		builder: '@storybook/builder-webpack5',
	},
	env: (config) => ({
		...config,
		NODE_ENV: 'development',
	}),
	webpackFinal: async (config, { configType }) => {
		// `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
		// You can change the configuration based on that.
		// 'PRODUCTION' is used when building the static version of storybook.

		// Make whatever fine-grained changes you need
		config.module.rules.push({
			test: /\.scss$/,
			use: ['style-loader', 'css-loader', 'sass-loader'],
			include: path.resolve(__dirname, '../'),
		});

		config.resolve = {
			modules: [
				...(config.resolve.modules || []),
				path.resolve(__dirname, '../src'),
			],
			fallback: {
				...(config.resolve || {}).fallback,
				fs: false,
				stream: false,
				os: false,
			},
		};

		// Return the altered config
		return config;
	},
};
