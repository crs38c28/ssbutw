const path = require('path');
const glob = require('glob');

function getEntry(globPath) {
  const entries = {};
  let basename;
  let tmp;
  let pathname;
  glob.sync(globPath).forEach((entry) => {
    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split('/').splice(-2);
    console.log(tmp);
    pathname = basename;
    entries[pathname] = {
      entry: `src/${tmp[0]}/${tmp[1].split('.')[0]}.js`,
      template: 'src/index.html',
      title: tmp[1].split('.')[0],
      filename: `${tmp[0]}/${tmp[1].split('.')[0]}.html`,
      chunks: ['chunk-vendors', 'chunk-common', tmp[1].split('.')[0]],
    };
  });
  return entries;
}

const pages = getEntry('./src/?(dashboard|graphics)/*.vue');

module.exports = {
  publicPath: '../',
  productionSourceMap: false,
  pages,
  filenameHashing: true,

  css: {
    loaderOptions: {
      css: {
        url: false,
      },
    },
  },

  chainWebpack(config) {
    config.output.filename('js/[name].js');
  },

  pluginOptions: {
    i18n: {
      locale: 'zh_Hant_TW',
      fallbackLocale: 'en_US',
      localeDir: 'lang',
      enableInSFC: false,
    },
  },
};
