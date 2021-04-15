import { defineConfig } from 'umi';
import routes from './config/routes';

export default defineConfig({
  history: {
    type: 'hash',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  favicon: '/assets/ts.png',
  routes,
  fastRefresh: {},
  cssModulesTypescriptLoader: {},
  alias: {
    lib: '@/lib',
    i18n: '@/i18n',
    components: '@/components',
    common: '@/common',
    api: '@/api'
  },
  proxy: {
    '/api.json': {
      target: 'http://192.168.0.135:8888',
      changeOrigin: true,
    }
  },
  copy: [
    {
      from: 'public/assets/',
      to: 'assets/'
    }
  ],
  chunks: ['vendors', 'voltsdk', 'umi'],
  chainWebpack: function (config, { webpack }) {
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {

            voltsdk: {
              name: "voltsdk",
              test: /[\\/]node_modules[\\/](voltsdk)[\\/]/,
              priority: 10,
              enforce: true,
            },
            vendors: {
              name: "vendors",
              test: /[\\/]node_modules[\\/](?!voltsdk).*$/,
              priority: 11,
              enforce: true,
            },
          },
        },
      }
    });
  },
});