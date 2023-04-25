module.exports = {
    plugins: [
        'autoprefixer',
        [
            'postcss-preset-env',
            {
                stage: 2,
                browsers: ['last 2 versions'],
                autoprefixer: true,
            },
        ],
    ],
}
