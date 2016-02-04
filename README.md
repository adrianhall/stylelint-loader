[![Dependency Status](https://david-dm.org/adrianhall/stylelint-loader.svg)](https://david-dm.org/adrianhall/stylelint-loader)
[![devDependency Status](https://david-dm.orgadrianhall/stylelint-loader/dev-status.svg)](https://david-dm.org/adrianhall/stylelint-loader#info=devDependencies)

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

Create your [lint configuration] in the same way as stylelint.  Specify the
configuration file, probably as a .stylelint.config.js file, in the stylelint
section of the webpack.config.js.

You can specify the following options in the stylelint section of your
webpack.config.js file:

* **config** is a stylelint configuration object
* **configFile** is the path to a JSON, YAML or JS file that contains your configuration
* **configBasedir** is an absolute path to a directory for relative paths defining extends and plugins in your configuration
* **configOverrides** is a partial stylelint configuration object

If you do not specify config or configFile, then stylelint-loader will look in the
[standard rc-file places](https://github.com/dominictarr/rc#standards) for a .stylelint.config.js
file.

For more information, please review the [stylelint node API documentation](https://github.com/stylelint/stylelint/blob/master/docs/user-guide/node-api.md).


## More Information

Please check out all the options available via [stylelint]

[Stylelint]: http://stylelint.io
[PostCSS]: https://github.com/postcss/postcss
[stylelint]: http://stylelint.io
[Webpack]: http://webpack.github.io/
[lint configuration]: https://github.com/stylelint/stylelint/blob/3.2.0/docs/user-guide/configuration.md

## Contributing

Firstly, thanks for even thinking about contributing. We welcome pull requests and, since this is not sponsored by an organization,
we don't have any fancy CLAs to fill in. Please follow our [Contributing Guide](CONTRIBUTING.md) to get started.
