import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import flow from 'rollup-plugin-flow';

export default [
  {
    input: 'share.js',
    output: [
      {
        file: 'dist/share.cjs.js',
        format: 'cjs',
        exports: 'named',
        name: 'shareUtils'
      },
      {
        file: 'dist/share.es.js',
        format: 'es',
        exports: 'named',
        name: 'shareUtils'
      }
    ],
    external: ['@metro-prez/common-utils'],
    plugins: [flow()]
  },
  {
    input: 'share.js',
    output: [
      {
        file: 'dist/share.min.js',
        format: 'iife',
        exports: 'named',
        name: 'shareUtils'
      }
    ],
    plugins: [resolve(), flow(), terser()]
  }
];
