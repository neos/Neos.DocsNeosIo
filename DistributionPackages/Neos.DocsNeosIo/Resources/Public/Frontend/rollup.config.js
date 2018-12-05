import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;


export default {
    input: 'js/app.js',
    output: {
        file: 'build/app.js',
        format: 'iife', // immediately-invoked function expression — suitable for <script> tags
        sourcemap: true
    },
    watch: {
        include: 'js/**'
    },
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**' // only transpile our source code
        }),
        production && uglify() // minify, but only in production
    ]
};
