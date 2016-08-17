# DEPRECATION NOTICE

This package is not deprecated.  Do not use.  Replace your packages with [postcss-loader]
or [webpack-stylelint-loader] instead.  

## Recursively Linting with Stylelint

[Stylelint] does not do a good job of handling imported files, and stylelint-loader is a wrapper
around stylelint, so it inherits all the bugs and issues of stylelint.  You can use the
[stylelint-webpack-plugin] to recursively lint all your stylesheets.  See the [stylelint-webpack-plugin]
for more details (and thanks to @vieron for providing the plugin).

I'm likely to be shutting down stylelint-loader in preference to the stylelint-webpack-plugin in the future.

[Stylelint]: http://stylelint.io
[stylelint-webpack-plugin]: https://www.npmjs.com/package/stylelint-webpack-plugin
[postcss-loader]: https://www.npmjs.com/package/postcss-loader

## Contributing

I am no longer accepting contributions as this package is deprecated.
