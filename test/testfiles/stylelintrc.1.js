module.exports = {
    rules: {
        // This next line is an error in the rule
        'color-hex-case': [ 2, 'lower' ],
        'selector-list-comma-newline-after': [ 'always', { warn: true } ],
        'unit-blacklist': [ 'em' ],
        'unit-whitelist': [ 'px' ]
    }
}
