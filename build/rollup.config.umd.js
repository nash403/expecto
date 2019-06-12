import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    exports: 'named',
    name: 'v-expecto',
    file: 'dist/v-expecto.umd.js',
    format: 'umd',
  },
})

export default config
