/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	/* config options here */
	reactStrictMode: true,
	webpack: (config) => {
		config.module.rules.push({
			test: /\.node/,
			use: 'raw-loader',
		});

		return config;
	},
	// Use the correct configuration option for external packages
	serverExternalPackages: ['pdf-lib'],
};

module.exports = nextConfig; 