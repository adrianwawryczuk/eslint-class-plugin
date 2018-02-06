'use strict';

export default {
    rules: {
        'no-exclusive-tests': require('./rules/no-undeclarated-fields'),
    },
    configs: {
        recommended: {
            rules: {
                'mocha/no-exclusive-tests': 2
            }
        }
    }
};