module.exports = {
    reactStrictMode: false,
    images: {
        domains: ["127.0.0.1", "95.140.159.97", "codeby.games", "event.codeby.games"],
    },
    env: {
        apiUrl: "http://95.140.159.97:30006",
        ip_from_env: "62.173.140.174",
    },
    webpack(config) {
        config.module.rules.push(
            {
                test: /\.svg$/,
                use: [{ loader: '@svgr/webpack', options: { icon: true } }],
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            );
        return config;
    },
};
