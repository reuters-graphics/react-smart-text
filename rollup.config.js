import babel from '@rollup/plugin-babel';
import externals from 'rollup-plugin-node-externals';
import packageJson from './package.json';
import resolve from '@rollup/plugin-node-resolve';

const plugins = [
  resolve({ preferBuiltins: true, modulesOnly: true }),
  babel({ presets: ['@babel/preset-react'] }),
  externals({ deps: true }),
];

const output = [{
  file: packageJson.main,
  format: 'cjs',
  exports: 'default',
  paths: { '@reuters-graphics/react-smart-text': './dist/index.js' },
}, {
  file: packageJson.module,
  format: 'es',
  exports: 'default',
  paths: { '@reuters-graphics/react-smart-text': './dist/index.js' },
}];

export default [{
  input: 'src/index.js',
  output,
  plugins,
}];
