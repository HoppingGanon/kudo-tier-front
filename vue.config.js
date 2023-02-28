const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PUBLIC_PATH ? process.env.VUE_APP_PUBLIC_PATH : '/',

  devServer: {
    port: Number.parseInt(process.env.VUE_APP_PORT),
    // host: 'localhost'
    allowedHosts: ['localhost', process.env.VUE_APP_ALLOW_HOST],
    compress: true
  },

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  },

  pages: {
    index: {
      entry: 'src/main.ts',
      title: 'くどくどTier'
    }
  },
  chainWebpack: config => {
    config.plugin('VuetifyLoaderPlugin').tap(args => [{
      match (originalTag, { kebabTag, camelTag }) {
        if (kebabTag.startsWith('core-')) {
          return [camelTag, `import ${camelTag} from '@/components/core/${camelTag.substring(4)}.vue'`]
        }
      }
    }])
  }
})
