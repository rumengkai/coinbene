module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : './',

  pwa: {
    name: './'
  },

  lintOnSave: process.env.NODE_ENV !== 'production'
}
