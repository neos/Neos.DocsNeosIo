import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

export default {
    input: {
		app: 'js/app.js',
		prism: 'js/prism.js',
	},
    output: {
        dir: 'build',
        sourcemap: true
    },
    watch: {
        include: '../../../../**/*.js'
    },
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**' // only transpile our source code
        }),
        terser()
    ]
};
