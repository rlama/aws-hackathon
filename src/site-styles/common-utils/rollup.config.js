import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'common-utils.js',
    output: [
      {
        file: 'dist/common-utils.cjs.js',
        format: 'cjs',
        exports: 'named',
        name: 'commonUtils'
      }
    ],
    external: ['d3-format']
  },
  {
    input: 'common-utils.js',
    output: [
      {
        file: 'dist/common-utils.min.js',
        format: 'iife',
        exports: 'named',
        name: 'commonUtils'
      }
    ],
    plugins: [resolve(), terser()]
  }
];
