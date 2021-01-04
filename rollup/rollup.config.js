import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import babel from '@rollup/plugin-babel';
import artTemplate from '../rollup-art-template/index';
export default {
    input: 'src/js/index.js',
    plugins: [
        image(),
        babel(
            { babelHelpers: 'bundled' }
        ),
        artTemplate(),
        resolve(), // so Rollup can find `ms`
        commonjs() // so Rollup can convert `ms` to an ES module
    ],
    output: {
        file: 'dist/DPlayer.esm.js',
        format: 'esm',
    },
};
