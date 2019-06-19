module.exports = {
    root: true,
    extends: [
        'kentcdodds',
    ],
    rules: {
        'no-console': 'error',
        'no-debugger': 'error',
        // forbid useless extra space
        'no-multi-spaces': [
            'error',
            {
                exceptions: {
                    Property: true,
                    VariableDeclarator: true,
                    ImportDeclaration: true,
                    AssignmentExpression: true,
                },
            },
        ],
        // better alignement for const declarations & key/value pair declarations in objects
        'key-spacing': [
            'error',
            {
                singleLine: {
                    beforeColon: false,
                    afterColon: true,
                },
                multiLine: {
                    beforeColon: false,
                    afterColon: true,
                    align: 'colon',
                },
            },
        ],
        'no-unused-expressions': ['error', { 'allowShortCircuit': true, 'allowTernary': true, 'allowTaggedTemplates': true }],
        'babel/no-unused-expressions': 'off',
        'comma-dangle': ['error', 'always-multiline'],
        'import/prefer-default-export': 'off',
        'func-style': ["error", "declaration", { "allowArrowFunctions": true }]
    }
}