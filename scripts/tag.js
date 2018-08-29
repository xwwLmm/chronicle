require('./check-version')();
require('shelljs/global');

var inquirer = require('inquirer');
var chalk = require('chalk');
var path = require('path');
var fs = require('fs');
var semver = require('semver');

var packageJsonPath = path.resolve(process.cwd(), 'package.json');
var packageJson = require(packageJsonPath);
var packageJsonVersion = packageJson.version;

var verOptList = getVersionOptions(packageJsonVersion);

inquirer.prompt([{
    name: 'version',
    message: `选择将要升级的版本(当前版本 ${packageJsonVersion} )：`,
    type: 'list',
    default: 0,
    choices: verOptList
}, {
    name: 'message',
    message: '版本发布说明',
    type: 'input',
    default: ''
}]).then(function (answers) {
    const version = answers.version;
    var commitMessage = `"chore(package.json): bump version to ${version}"`;
    var message = `"${answers.message}"` || 'v' + version;
    packageJson.version = version;
    fs.writeFileSync(process.cwd() + '/package.json', JSON.stringify(packageJson, null, '  '));
    var cmd = `git add package.json && git commit -m ${commitMessage} && git tag -a ${version} -m ${message} && git push origin master && git push origin --tags`;

    exec(cmd);

    console.log();
    console.log(chalk.green(`   成功，当前版本为( ${version} ) `));
    console.log();
});

/**
 * 获取升级版本列表
 */
function getVersionOptions (version) {
    version = version.split('+');

    var currentVersion = version[0];
    var levels = ['patch', 'minor', 'major'];
    var opts = [];

    levels.forEach(function(item) {
        var val = semver.inc(currentVersion, item);
        opts.push({
            name: val,
            value: val
        })
    });

    return opts;
}

process.on('unhandledRejection', function(a, b) {
    console.log(a, b);
});
