const mix = require('laravel-mix');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.webpackConfig({
    stats: {
        children: true,
    },
    plugins:
    [
        new WebpackShellPluginNext({onBuildStart:['php artisan lang:js --quiet'], onBuildEnd:[]})
    ]
});

mix.js('resources/js/app.jsx', 'public/js')
    .react()
    .postCss('resources/css/app.css', 'public/css', [require('tailwindcss'), require('autoprefixer')])
    .alias({
        '@': 'resources/js',
    });

if (mix.inProduction()) {
    mix.version();
}
