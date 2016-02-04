/* global __dirname */
'use strict';

var assign = require('object-assign'),
    chalk = require('chalk'),
    fs = require('fs'),
    loaderUtils = require('loader-utils'),
    path = require('path'),
    stylelint = require('stylelint');

var defaultOptions = {
    configFile: './.stylelint.config.js',
    displayOutput: true,
    ignoreCache: false
};

var lintedFiles = [];

/**
 * Determine if the provided file is in the cache
 * @param {string} filePath the file to check
 * @returns {bool} true if the file is in the cache
 */
function isCached(filePath) {
    return lintedFiles.findIndex((t) => { return t === filePath; }) !== -1;
}

/**
 * Returns the relative path
 * @param {string} filePath the path to make relative
 * @returns {string} the relative path
 */
function relativePath(filePath) {
    return filePath.indexOf(__dirname) === 0 ? filePath.replace(__dirname, '.') : filePath;
}

/**
 * Display a single error or warning
 * @param {Object} warning the warning object
 * @param {Number} warning.line the line number
 * @param {Number} warning.column the column number
 * @param {string} warning.text the error or warning message
 * @param {string} warning.severity the severity (warning or error)
 * @param {Object} options the loader options
 * @param {Object} context the Webpack context
 * @returns {void}
 */
function printWarningOrError(warning, options, context) {
    var text = `${warning.line}:${warning.column} ${warning.text}`;

    if (warning.severity === 'warning') {
        if (options.displayOutput)
            console.log(chalk.yellow(text));
        context.emitWarning(text);
    } else if (warning.severity === 'error') {
        if (options.displayOutput)
            console.log(chalk.red(text));
        context.emitError(text);
    }
}

/**
 * Lint the provided file
 */
function linter(content, options, context, callback) {
    var filePath = relativePath(context.resourcePath),
        lintOptions = {};

    // Figure out if we need to process this file
    if (!options.ignoreCache) {
        if (!isCached(context.resourcePath)) {
            lintedFiles.push(context.resourcePath);
        } else {
            if (callback) {
                return callback(null, content);
            }
            return null;
        }
    }

    lintOptions = assign({}, options, {
        code: fs.readFileSync(context.resourcePath, { encoding: 'utf-8' }),
        syntax: path.extname(filePath).replace('.', ''),
        formatter: 'json'
    });


    stylelint.lint(lintOptions)
    .then(result => { return result.results[0]; })
    .then(result => {
        if (options.displayOutput && result.warnings.length > 0) {
            console.log(chalk.blue.underline.bold(filePath));
            result.warnings.forEach(warning => { printWarningOrError(warning, options, context); });
            console.log('');
        }
        callback(null, content);
    }).catch(error => {
        callback(error);
    });
}

/**
 * Webpack Loader Definition
 *
 * @param {string|buffer} content = the content to be linted
 */
module.exports = function(content) {
    this.cacheable && this.cacheable();
    var callback = this.async();

    var packOptions = this.options.stylelint || {};
    var loaderOptions = loaderUtils.parseQuery(this.query);
    var options = assign({}, defaultOptions, packOptions, loaderOptions);

    try {
        linter(content, options, this, callback);
    } catch (error) {
        console.error('[stylelint-loader] error = ', error.stack);
        callback(error);
    }
};
