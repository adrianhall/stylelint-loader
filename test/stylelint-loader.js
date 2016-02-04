/* global __dirname, describe, it */
var expect = require('chai').expect,
    assign = require('object-assign'),
    path = require('path'),
    webpack = require('webpack'),
    MemoryFileSystem = require('memory-fs'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

var loaderUnderTest = path.join(__dirname, '../index');

var baseConfig = {
    debug: false,
    output: {
        path: path.join(__dirname, 'output')
    },
    module: {
        preLoaders: [
            { test: /\.(sass|scss)$/, loader: loaderUnderTest }
        ],
        loaders: [
            { test: /\.(sass|scss)$/, loader: 'file' }
        ]
    },
    stylelint: {
        displayOutput: true,
        ignoreCache: true
    }
};

var extractConfig = {
    debug: true,
    output: {
        path: path.join(__dirname, 'output')
    },
    module: {
        preLoaders: [
            { test: /\.(sass|scss)$/, loader: loaderUnderTest }
        ],
        loaders: [
            { test: /\.(sass|scss)$/, loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap') }
        ]
    },
    stylelint: {
        displayOutput: true
    },
    plugins: [
        new ExtractTextPlugin(path.join(__dirname, 'output/bundle.css'))
    ]
};

var outputFileSystem = new MemoryFileSystem();

/**
 * This is the basic in-memory compiler
 */
function pack(testConfig, callback) {
    var compiler = webpack(testConfig);
    compiler.outputFileSystem = outputFileSystem;
    compiler.run(callback);
}

/**
 * Test Suite
 */
describe('stylelint-loader', function () {
    it('works with a simple file', function (done) {
        var config = {
            entry: './test/testfiles/test1'
        };

        // Test 1 is a perfectly valid sass file
        pack(assign({}, baseConfig, config), function (err, stats) {
            expect(err).to.not.exist;
            expect(stats.compilation.errors.length).to.equal(0);
            expect(stats.compilation.warnings.length).to.equal(0);
            done(err);
        });
    });

    it('sends warnings properly', function (done) {
        var config = {
            entry: './test/testfiles/test2'
        };

        // Test 2 should produce a warning because of the default settings
        pack(assign({}, baseConfig, config), function (err, stats) {
            expect(err).to.not.exist;
            expect(stats.compilation.errors.length).to.equal(0);
            expect(stats.compilation.warnings.length).to.equal(1);
            done(err);
        });
    });

    it('sends errors properly', function (done) {
        var config = {
            entry: './test/testfiles/test3'
        };

        // Test 3 should produce an error for the font-size units
        pack(assign({}, baseConfig, config), function (err, stats) {
            expect(err).to.not.exist;
            expect(stats.compilation.errors.length).to.equal(1);
            expect(stats.compilation.warnings.length).to.equal(0);
            done(err);
        });
    });

    it('can specify a rule via config', function (done) {
        var config = {
            entry: './test/testfiles/test4',
            stylelint: {
                configOverrides: {
                    rules: {
                        'unit-blacklist': [ 'em' ],
                        'unit-whitelist': [ 'px' ]
                    }
                }
            }
        };

        // Test 4 (which is identical) should now pass
        pack(assign({}, baseConfig, config), function (err, stats) {
            expect(err).to.not.exist;
            expect(stats.compilation.errors.length).to.equal(0);
            expect(stats.compilation.warnings.length).to.equal(0);
            done(err);
        });
    });

    it('can specify a config file via config', function (done) {
        var config = {
            entry: './test/testfiles/test5',
            stylelint: {
                configFile: path.join(__dirname, './testfiles/stylelintrc.js')
            }
        };

        // Test 3 should now pass
        pack(assign({}, baseConfig, config), function (err, stats) {
            expect(err).to.not.exist;
            expect(stats.compilation.errors.length).to.equal(0);
            expect(stats.compilation.warnings.length).to.equal(0);
            done(err);
        });
    });

    it('should only report once when using ExtractText', function (done) {
        var config = {
            entry: './test/testfiles/test6'
        };

        // Test 2 should produce a warning because of the default settings
        pack(assign({}, extractConfig, config), function (err, stats) {
            expect(err).to.not.exist;
            expect(stats.compilation.errors.length).to.equal(0);
            expect(stats.compilation.warnings.length).to.equal(1);
            done(err);
        });
    });
});