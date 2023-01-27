import { IconSize, PointDisplaySize, RankingTheme } from './review'

export interface SelectObject <T = string | number, D = string | number> {
  value: T,
  text: D,
  icon?: string
}

export type TierSortType = 'updatedAtDesc' | 'updatedAtAsc' | 'createdAtDesc' | 'createdAtAsc'
export type TierContentType = 'review' | 'tier'

// Tierの表示ソート順
export const tierSortTypeList: SelectObject<TierSortType>[] = [
  {
    value: 'updatedAtDesc',
    text: '更新が新しい順'
  },
  {
    value: 'updatedAtAsc',
    text: '更新が古い順'
  },
  {
    value: 'createdAtDesc',
    text: '作成が新しい順'
  },
  {
    value: 'createdAtAsc',
    text: '作成が古い順'
  }
]

// Tierの検索対象
export const tierContentTypeList: SelectObject<TierContentType>[] = [
  {
    value: 'tier',
    text: 'Tier'
  },
  {
    value: 'review',
    text: 'レビュー(実装予定)'
  }
]

/**
 * バリデーション状態
 * none...一度も開いていない
 * unknown...開いたが、検証していない
 * checked...検証済み
 * error...検証の結果、入力エラー
 */
export type ValidState = 'none' | 'unknown' | 'checked' | 'error'

/** 基本的な保存画像の形式 */
export type ImageFileFormat = 'jpg' | 'png'

/** 基本的な保存画像のリスト */
export const ImageFormatList: SelectObject<ImageFileFormat>[] = [
  {
    text: 'JPEGファイル',
    value: 'jpg'
  },
  {
    text: 'PNGァイル',
    value: 'png'
  }
]

export const iconSizeList: SelectObject<IconSize>[] = [
  {
    text: '特大',
    value: '96px'
  },
  {
    text: '大',
    value: '64px'
  },
  {
    text: '普通',
    value: '48px'
  },
  {
    text: '小',
    value: '32px'
  },
  {
    text: '最小',
    value: '24px'
  }
]

export const textSizeList: SelectObject<PointDisplaySize>[] = [
  {
    text: '最大',
    value: 'large5'
  },
  {
    text: '特大',
    value: 'large4'
  },
  {
    text: '大',
    value: 'large3'
  },
  {
    text: '普通',
    value: 'large2'
  },
  {
    text: '小',
    value: 'large'
  },
  {
    text: '最小',
    value: 'normal'
  }
]

export const tierThemeList: SelectObject<RankingTheme>[] = [
  {
    text: 'ノーマルテーマ',
    value: 'light'
  },
  {
    text: 'ノーマルテーマ(反転)',
    value: 'light-reverse'
  },
  {
    text: 'ダークテーマ',
    value: 'dark'
  },
  {
    text: 'ダークテーマ(反転)',
    value: 'dark-reverse'
  }
]
