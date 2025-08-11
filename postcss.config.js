module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'not ie 11',
        'not dead'
      ]
    })
  ]
};
