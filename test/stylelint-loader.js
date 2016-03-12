/* global __dirname, describe, it */
var expect = require('chai').expect,
    assign = require('deep-assign'),
    path = require('path'),
    webpack = require('webpack'),
    MemoryFileSystem = require('memory-fs'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

/*
** DISPLAY_OUTPUT
**  Set env:MOCHA_DISPLAY_MODE to true if you want to see the errors from stylelint
*/
var displayOutput = (typeof process.env.MOCHA_DISPLAY_MODE !== 'undefined' && process.env.MOCHA_DISPLAY_MODE === 'true');

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
        displayOutput: displayOutput,
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
        displayOutput: displayOutput
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
    it('T1:works with a simple file', function (done) {
        var config = {
            entry: './test/testfiles/test1'
        };

        pack(assign({}, baseConfig, config), function (err, stats) {
            expect(err).to.not.exist;
            expect(stats.compilation.errors.length).to.equal(0);
            expect(stats.compilation.warnings.length).to.equal(0);
            done(err);
        });
    });

    it('T2:sends warnings properly', function (done) {
        var config = {
            entry: './test/testfiles/test2'
        };

        pack(assign({}, baseConfig, config), function (err, stats) {
            expect(err).to.not.exist;
            expect(stats.compilation.errors.length).to.equal(0);
            expect(stats.compilation.warnings.length).to.equal(1);
            done(err);
        });
    });

    it('T3:sends errors properly', function (done) {
        var config = {
            entry: './test/testfiles/test3'
        };

        pack(assign({}, baseConfig, config), function (err, stats) {
            expect(err).to.not.exist;
            expect(stats.compilation.errors.length).to.equal(1);
            expect(stats.compilation.warnings.length).to.equal(0);
            done(err);
        });
    });

    it('T4:can specify a rule via config', function (done) {
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

        pack(assign({}, baseConfig, config), function (err, stats) {
            expect(err).to.not.exist;
            expect(stats.compilation.errors.length).to.equal(0);
            expect(stats.compilation.warnings.length).to.equal(0);
            done(err);
        });
    });

    it('T5:can specify a config file via config', function (done) {
        var config = {
            entry: './test/testfiles/test5',
            stylelint: {
                configFile: path.join(__dirname, './testfiles/stylelintrc.js')
            }
        };

        pack(assign({}, baseConfig, config), function (err, stats) {
            expect(err).to.not.exist;
            expect(stats.compilation.errors.length).to.equal(0);
            expect(stats.compilation.warnings.length).to.equal(0);
            done(err);
        });
    });

    it('T6:should only report once when using ExtractText', function (done) {
        var config = {
            entry: './test/testfiles/test6'
        };

        pack(assign({}, extractConfig, config), function (err, stats) {
            expect(err).to.not.exist;
            expect(stats.compilation.errors.length).to.equal(0);
            expect(stats.compilation.warnings.length).to.equal(1);
            done(err);
        });
    });

    it('T7:warns if the config file does not exist', function (done) {
        var config = {
            entry: './test/testfiles/test7',
            stylelint: {
                configFile: path.join(__dirname, './testfiles/WARN_stylelintrc.js')
            }
        };

        pack(assign({}, baseConfig, config), function (err, stats) {
            expect(err).to.not.exist;
            expect(stats.compilation.errors.length).to.equal(0);
            expect(stats.compilation.warnings.length).to.equal(1);
            done(err);
        });
    });

    it('T8:should report errors in rules', function (done) {
        var config = {
            entry: './test/testfiles/test8',
            stylelint: {
                configFile: path.join(__dirname, './testfiles/stylelintrc.1.js')
            }
        };

        pack(assign({}, extractConfig, config), function (err, stats) {
            expect(err).to.not.exist;
            expect(stats.compilation.errors.length).to.equal(1);
            expect(stats.compilation.warnings.length).to.equal(0);
            done(err);
        });
    });

    // THIS DOES NOT WORK WITH STYLELINT (v4.5.1)
    // it('T9:works with included files', function (done) {
    //     var config = {
    //         entry: './test/testfiles/test9'
    //     };

    //     pack(assign({}, baseConfig, config), function (err, stats) {
    //         expect(err).to.not.exist;
    //         expect(stats.compilation.errors.length).to.equal(1);
    //         expect(stats.compilation.warnings.length).to.equal(0);
    //         done(err);
    //     });
    // });
});