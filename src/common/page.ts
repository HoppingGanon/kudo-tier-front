export interface SelectObject <T = string | number, D = string | number> {
  value: T,
  text: D
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
