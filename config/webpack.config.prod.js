"use strict";

const autoprefixer = require("autoprefixer");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const eslintFormatter = require("react-dev-utils/eslintFormatter");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const paths = require("./paths");
const getClientEnv = require("./env");

const publicPath = paths.servedPath;
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = publicPath === "./";
// source map 文件过大, 可能引起 out of memory.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1);

// 稍后被 inject 的环境变量
const env = getClientEnv(publicUrl);

// ensure NODE_ENV == "production""
if (env.stringified["process.env"].NODE_ENV !== '"production"') {
    throw new Error("Production builds must have NODE_ENV=production.");
}

const cssFilename = "static/css/[name].[contenthash:8].css";

// ExtractTextPlugin expects the build output to be flat.
// (See https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/27)
// However, our output is structured with css, js and media folders.
// To have this structure working with relative paths, we have to use custom options.
const extractTextPluginOptions = shouldUseRelativeAssetPaths
    ? // Making sure that the publicPath goes back to to build folder.
      { publicPath: Array(cssFilename.split("/").length).join("../") }
    : {};

module.exports = {
    // Don't attempt to continue if there are any errors.
    bail: true,
    // We generate sourcemaps in production. This is slow but gives good results.
    // You can exclude the *.map files from the build during deployment.
    devtool: shouldUseSourceMap ? "source-map" : false,
    entry: [paths.appIndexJs],
    output: {
        path: paths.appBuild,
        // Generated JS file names (with nested folders).
        // There will be one main bundle, and one file per asynchronous chunk.
        // We don't currently advertise code splitting but Webpack supports it.
        filename: "static/js/[name].[chunkhash:8].js",
        chunkFilename: "static/js/[name].[chunkhash:8].chunk.js",
        // We inferred the "public path" (such as / or /my-project) from homepage.
        publicPath: publicPath,
        // Point sourcemap entries to original disk location (format as URL on Windows)
        devtoolModuleFilenameTemplate: info =>
            path
                .relative(paths.appSrc, info.absoluteResourcePath)
                .replace(/\\/g, "/")
    },
    resolve: {
        modules: ["node_modules", paths.appNodeModules],
        extensions: [".mjs", ".js", ".json", ".jsx"],
        alias: {
            "@": paths.appSrc
        },
        plugins: [new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])]
    },
    module: {
        strictExportPresence: true,
        rules: [
            // 在 babel-loader 之前执行 lint
            {
                test: /\.(js|jsx|mjs)$/,
                enforce: "pre",
                use: [
                    {
                        options: {
                            formatter: eslintFormatter,
                            eslintPath: require.resolve("eslint")
                        },
                        loader: require.resolve("eslint-loader")
                    }
                ],
                include: paths.appSrc
            },
            {
                // "oneOf" will traverse all following loaders until one will
                // match the requirements. When no loader matches it will fall
                // back to the "file" loader at the end of the loader list.
                oneOf: [
                    // "url" loader works just like "file" loader but it also embeds
                    // assets smaller than specified size as data URLs to avoid requests.
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve("url-loader"),
                        options: {
                            limit: 10000,
                            name: "static/media/[name].[hash:8].[ext]"
                        }
                    },
                    // babel
                    {
                        test: /\.(js|jsx|mjs)$/,
                        include: paths.appSrc,
                        loader: require.resolve("babel-loader"),
                        options: {
                            plugins: [
                                "transform-decorators-legacy",
                                "transform-runtime",
                                [
                                    "import",
                                    [{ libraryName: "antd", style: "css" }]
                                ]
                            ],
                            compact: true
                        }
                    },
                    // "postcss" loader applies autoprefixer to our CSS.
                    // "css" loader resolves paths in CSS and adds assets as dependencies.
                    // "style" loader normally turns CSS into JS modules injecting <style>,
                    // but unlike in development configuration, we do something different.
                    // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
                    // (second argument), then grabs the result CSS and puts it into a
                    // separate file in our build process. This way we actually ship
                    // a single CSS file in production instead of JS code injecting <style>
                    // tags. If you use code splitting, however, any async bundles will still
                    // use the "style" loader inside the async code so CSS from them won't be
                    // in the main CSS file.
                    {
                        test: [/\.css$/, /\.less$/],
                        exclude: [/node_modules/],
                        loader: ExtractTextPlugin.extract(
                            Object.assign(
                                {
                                    fallback: {
                                        loader: require.resolve("style-loader"),
                                        options: {
                                            hmr: false
                                        }
                                    },
                                    use: [
                                        {
                                            loader: require.resolve(
                                                "css-loader"
                                            ),
                                            options: {
                                                importLoaders: 1,
                                                minimize: true,
                                                modules: true,
                                                sourceMap: shouldUseSourceMap
                                            }
                                        },
                                        {
                                            loader: require.resolve(
                                                "postcss-loader"
                                            ),
                                            options: {
                                                // Necessary for external CSS imports to work
                                                // https://github.com/facebookincubator/create-react-app/issues/2677
                                                ident: "postcss",
                                                plugins: () => [
                                                    require("postcss-flexbugs-fixes"),
                                                    autoprefixer({
                                                        browsers: [
                                                            ">1%",
                                                            "last 4 versions",
                                                            "Firefox ESR",
                                                            "not ie < 9" // React doesn't support IE8 anyway
                                                        ],
                                                        flexbox: "no-2009"
                                                    })
                                                ]
                                            }
                                        },
                                        {
                                            loader: require.resolve('less-loader'), 
                                        }
                                    ]
                                },
                                extractTextPluginOptions
                            )
                        )
                        // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
                    },
                    {
                        test: /\.css$/,
                        exclude: [/src/],
                        loader: ExtractTextPlugin.extract(
                            Object.assign(
                                {
                                    fallback: {
                                        loader: require.resolve("style-loader"),
                                        options: {
                                            hmr: false
                                        }
                                    },
                                    use: [
                                        {
                                            loader: require.resolve(
                                                "css-loader"
                                            ),
                                            options: {
                                                importLoaders: 1,
                                                minimize: true,
                                                sourceMap: shouldUseSourceMap
                                            }
                                        },
                                        {
                                            loader: require.resolve(
                                                "postcss-loader"
                                            ),
                                            options: {
                                                // Necessary for external CSS imports to work
                                                // https://github.com/facebookincubator/create-react-app/issues/2677
                                                ident: "postcss",
                                                plugins: () => [
                                                    require("postcss-flexbugs-fixes"),
                                                    autoprefixer({
                                                        browsers: [
                                                            ">1%",
                                                            "last 4 versions",
                                                            "Firefox ESR",
                                                            "not ie < 9" // React doesn't support IE8 anyway
                                                        ],
                                                        flexbox: "no-2009"
                                                    })
                                                ]
                                            }
                                        },
                                        {
                                            loader: require.resolve('less-loader'), 
                                        }
                                    ]
                                },
                                extractTextPluginOptions
                            )
                        )
                        // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
                    },
                    // "file" loader makes sure assets end up in the `build` folder.
                    // When you `import` an asset, you get its filename.
                    // This loader doesn't use a "test" so it will catch all modules
                    // that fall through the other loaders.
                    {
                        loader: require.resolve("file-loader"),
                        // Exclude `js` files to keep "css" loader working as it injects
                        // it's runtime that would otherwise processed through "file" loader.
                        // Also exclude `html` and `json` extensions so they get processed
                        // by webpacks internal loaders.
                        exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
                        options: {
                            name: "static/media/[name].[hash:8].[ext]"
                        }
                    }
                    // ** STOP **
                    // file loader 后面不应该有其他的 loader, 添加 file-loader 前面
                ]
            }
        ]
    },
    plugins: [
        // Makes some environment variables available in index.html.
        // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
        // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
        // In production, it will be an empty string unless you specify "homepage"
        // in `package.json`, in which case it will be the pathname of that URL.
        new InterpolateHtmlPlugin(env.raw),
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        }),
        new webpack.DefinePlugin(env.stringified),
        // Minify the code.
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                // Disabled because of an issue with Uglify breaking seemingly valid code:
                // https://github.com/facebookincubator/create-react-app/issues/2376
                // Pending further investigation:
                // https://github.com/mishoo/UglifyJS2/issues/2011
                comparisons: false
            },
            mangle: {
                safari10: true
            },
            output: {
                comments: false,
                // Turned on because emoji and regex is not minified properly using default
                // https://github.com/facebookincubator/create-react-app/issues/2488
                ascii_only: true
            },
            sourceMap: shouldUseSourceMap
        }),
        // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
        new ExtractTextPlugin({
            filename: cssFilename
        }),
        // Generate a manifest file which contains a mapping of all asset filenames
        // to their corresponding output file so that tools can pick it up without
        // having to parse `index.html`.
        new ManifestPlugin({
            fileName: "asset-manifest.json"
        }),
        // Moment.js is an extremely popular library that bundles large locale files
        // by default due to how Webpack interprets its code. This is a practical
        // solution that requires the user to opt into importing specific locales.
        // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
        // You can remove this if you don't use Moment.js:
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty"
    }
};
