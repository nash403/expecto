import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    exports: 'named',
    name   : 'expecto',
    file   : 'dist/expecto.umd.js',
    format : 'umd',
  },
})

export default config
