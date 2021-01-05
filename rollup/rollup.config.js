import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import svg from './rollup-svg';
import babel from '@rollup/plugin-babel';
import artTemplate from '../rollup-art-template/index';
import define from 'rollup-plugin-define';
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin();
export default {
    input: 'src/js/index.js',
    plugins: [
        svg(),
        babel(
            { babelHelpers: 'bundled' }
        ),
        define({
            replacements: {
                DPLAYER_VERSION: `"${require('../package.json').version}"`,
                GIT_HASH: JSON.stringify(gitRevisionPlugin.version())
            },
        }),
        artTemplate(),
        resolve(), // so Rollup can find `ms`
        commonjs() // so Rollup can convert `ms` to an ES module
    ],
    output: {
        file: 'esm/DPlayer.esm.js',
        format: 'esm',
    },
};
