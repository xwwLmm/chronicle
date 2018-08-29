"use strict";

const path = require("path");
const fs = require("fs");
const url = require("url");

const appDirectory = fs.realpathSync(process.cwd());
const resolve = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path, needsSlash) {
    const hasSlash = path.endsWith("/");
    if (hasSlash && !needsSlash) {
        return path.substr(path, path.length - 1);
    } else if (!hasSlash && needsSlash) {
        return `${path}/`;
    } else {
        return path;
    }
}

const getPublicUrl = appPackageJson =>
    envPublicUrl || require(appPackageJson).homepage;

function getServedPath(appPackageJson) {
    const publicUrl = getPublicUrl(appPackageJson);
    const servedUrl =
        envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : "/");
    return ensureSlash(servedUrl, true);
}

module.exports = {
    dotenv: resolve(".env"),
    appBuild: resolve("build"),
    appPublic: resolve("public"),
    appHtml: resolve("public/index.html"),
    appIndexJs: resolve("src/index.js"),
    appPackageJson: resolve("package.json"),
    appSrc: resolve("src"),
    yarnLockFile: resolve("yarn.lock"),
    appNodeModules: resolve("node_modules"),
    publicUrl: getPublicUrl(resolve("package.json")),
    servedPath: getServedPath(resolve("package.json"))
};
