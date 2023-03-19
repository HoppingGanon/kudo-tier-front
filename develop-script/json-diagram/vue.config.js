const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/kudo-tier-front/components',

  pages: {
    index: {
      entry: 'src/main.ts',
      title: 'くどくどTier フロントエンド コンポーネント設計書'
    }
  },
})
