module.exports = {
    rules: {
        // This next line is an error in the rule
        'color-hex-case': 'error',
        'selector-list-comma-newline-after': [ 'always', { severity: 'warn' } ],
        'unit-blacklist': [ 'em' ],
        'unit-whitelist': [ 'px' ]
    }
}
