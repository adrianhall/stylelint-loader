[![Dependency Status](https://david-dm.org/adrianhall/stylelint-loader.svg)](https://david-dm.org/adrianhall/stylelint-loader)
[![devDependency Status](https://david-dm.org/adrianhall/stylelint-loader/dev-status.svg)](https://david-dm.org/adrianhall/stylelint-loader#info=devDependencies)

# stylelint-loader

[Stylelint] is a modern linter that helps you enforce consistent conventions  and
avoid errors in your stylesheets.  Powered by [PostCSS], [stylelint] can understand
any syntax that PostCSS can parse, including SASS and SCSS.

Stylelint-loader is a [Webpack] wrapper for handling stylelint verification while
using webpack.

## Installation

```
npm install --save-dev stylelint-loader stylelint
```

## Usage

In your webpack.config.js file:

```
module.exports = {
    // ...
    module: {
        preLoaders: [
            { test: /\.(sass|scss)$/, loader: 'stylelint' }
        ],
        loaders: [
            { test: /\.(sass|scss)$/, loader: 'style|css|sass' }
        ]
    },
    // ...
    stylelint: {
        configFile: path.join(__dirname, './.stylelint.config.js'),
        configOverrides: {
            rules: {
                // Your rule overrides here
            }
        }
    }
};
```

## Options

Create your [lint configuration] in the same way as stylelint.  Specify the configuration file,
probably as a .stylelintrc file, in the stylelint section of the webpack.config.js.

You can specify the following options in the stylelint section of your webpack.config.js file:

* **config** is a stylelint configuration object
* **configFile** is the path to a JSON, YAML or JS file that contains your configuration
* **configBasedir** is an absolute path to a directory for relative paths defining extends and plugins in your configuration
* **configOverrides** is a partial stylelint configuration object

If you do not specify config or configFile, then stylelint-loader will use the standard stylelint
semantics for finding a configuration file.  You can see the current rules in the [stylelint User Guide](https://stylelint.io/user-guide/configuration/).

For more information, please review the [stylelint node API documentation](https://github.com/stylelint/stylelint/blob/master/docs/user-guide/node-api.md).

## Recursively Linting with Stylelint

Stylelint does not do a good job of handling imported files, and stylelint-loader is a wrapper around stylelint, so it
inherits all the bugs and issues of stylelint.  You can use the [stylelint-webpack-plugin] to recursively lint all your
stylesheets.  See the [stylelint-webpack-plugin] for more details (and thanks to @vieron for providing the plugin).

I'm likely to be shutting down stylelint-loader in preference to the stylelint-webpack-plugin in the future.

## More Information

Please check out all the options available via [stylelint]

[Stylelint]: http://stylelint.io
[PostCSS]: https://github.com/postcss/postcss
[stylelint]: http://stylelint.io
[Webpack]: http://webpack.github.io/
[lint configuration]: http://stylelint.io/user-guide/configuration/
[stylelint-webpack-plugin]: https://www.npmjs.com/package/stylelint-webpack-plugin

## Contributing

Firstly, thanks for even thinking about contributing. We welcome pull requests and, since this is not sponsored by an organization,
we don't have any fancy CLAs to fill in. Please follow our [Contributing Guide](CONTRIBUTING.md) to get started.
