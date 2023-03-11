/** 名前 */
interface Names {
  contributors: {
    /** 役割 */
    charge: string
    /** 名前の配列 */
    names: string[]
  }[]
}

/** アプリ名 */
export const appName = 'くどくどTier'
/** 開発者 */
export const myName = 'Tanaka'
/** バージョン */
export const version = '0.5.0-beta'
/** ビルド年 */
export const buildDate = '2023'

const names: Names = {
  contributors: [
    {
      charge: '企画',
      names: [myName]
    },
    {
      charge: 'システム設計',
      names: [myName]
    },
    {
      charge: '製造',
      names: [myName]
    },
    {
      charge: 'テスト',
      names: [myName]
    },
    {
      charge: 'サーバー設計',
      names: [myName]
    },
    {
      charge: '運用',
      names: [myName]
    }
  ]
}

export default names
