import CommonApi from './commonapi'

/** レビュー構成要素のタイプ */
export type ReviewParagraphType = 'text' | 'twitterLink' | 'imageLink'

/**
 * セクションの構成要素
 */
export interface ReviewParagraph {
  /** 要素のタイプ */
  type: ReviewParagraphType
  /** 構成要素の内容 */
  body: string
}

/**
 * レビューのセクション
 */
export interface ReviewSection {
  /** セクションの見出し */
  title: string
  /** このセクションの構成要素 */
  parags: ReviewParagraph[]
}
export const reviewPointTypeArray = [
  'stars', 'rank7', 'rank14', 'score', 'point', 'unlimited'
] as const

/** レビューポイントの表現方法 */
export type ReviewPointType = typeof reviewPointTypeArray[number]

export const TierTableTypeArray = [
  'ranking', 'pivot'
] as const

/** レビューポイントの表現方法 */
export type TierTableType = typeof TierTableTypeArray[number]

/** レビューの表示方法 */
export type ReviewDisplayType = 'summary' | 'all'

/** レビューポイントの表示方法 */
export type ReviewPointDisplayType = 'normal' | 'radar'

/** レビュー評点 */
export interface ReviewFactorParam {
  /** レビュー評点の名称 */
  name: string
  /** ポイントか情報かフラグ */
  isPoint: boolean
  /** 評点の重み */
  weight: number
}

/** レビュー評点や情報 どちらか一つを持つ */
export interface ReviewFactor {
  /** レビューが持つ情報 */
  info?: string
  /** レビュー評点 */
  point?: number
}

/** レビュー評点の表示サイズ */
export type PointDisplaySize = 'smaller' | 'normal' | 'larger'

/** レビュー全体 */
export interface Review {
  /** review識別ID */
  reviewId: string

  /** 投稿したユーザーの表示名 */
  userName: string
  /** 投稿したユーザーのID */
  userId: string
  /** 投稿したユーザーのアイコンURL */
  userIconUrl: string

  /** 親tier識別ID */
  tierId: string

  /** レビューの表示タイトル */
  title: string
  /** 作品名や商品名 */
  name: string
  /** レビューのアイコンURL */
  iconUrl: string
  /** レビュー評点 */
  reviewFactors: ReviewFactor []

  /** レビューポイントの表示方法 レビュー単品でGetする際にのみ参照される */
  pointType?: ReviewPointType
  sections: ReviewSection[]
  createAt: Date
  updateAt: Date
}

/** 複数のレビューをまとめたグループ */
export interface Tier {
  /** Tier識別ID */
  tierId: string

  /** 投稿したユーザーの表示名 */
  userName: string
  /** 投稿したユーザーのID */
  userId: string
  /** 投稿したユーザーのアイコンURL */
  userIconUrl: string

  /** Tierの名称 */
  name: string

  /** 本文 */
  parags: ReviewParagraph[]

  /** Tierの構成要素 */
  reviews: Review[]
  /** レビューポイントの表示方法 */
  pointType: ReviewPointType
  /** レビュー評点に対する情報 */
  reviewFactorParams: ReviewFactorParam[]

  createAt: Date
  updateAt: Date

}

// 連想配列、辞書てきなもの
export type Dictionary<T> = { [name: string]: T }

// v-data-tableのヘッダ
export interface DataTableHeader {
  text: string
  value: string
  align?: 'start' | 'center' | 'end'
  sortable?: boolean
  filterable?: boolean
  groupable?: boolean
  divider?: boolean
  class?: string | string[]
  cellClass?: string | string[]
  width?: string | number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: (value: any, search: string, item: any) => boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sort?: (a: any, b: any) => number
}

/** Tierにおけるレビュー評点の表示についての分割数 */
export const pointTypeTierCountDic = {
  stars: 6,
  rank7: 7,
  rank14: 14,
  score: 11,
  point: 10,
  unlimited: 1
}

/** Tierをピボット表示する際の情報 */
export interface TierPivotInfomation {
  iconUrl: string
  reviewId: string
  point: number
}

export class ReviewFunc {
  static getReviewDisp (point: number, type :ReviewPointType) : number {
    let div = 100
    switch (type) {
      case 'stars':
        div = 100 / (pointTypeTierCountDic.stars - 1)
        return CommonApi.constrain(Math.ceil(point / div), 0, pointTypeTierCountDic.stars - 1)
      case 'rank7':
        div = 100 / (pointTypeTierCountDic.rank7 - 1)
        return CommonApi.constrain(Math.ceil(point / div), 0, pointTypeTierCountDic.rank7 - 1)
      case 'rank14':
        div = 100 / (pointTypeTierCountDic.rank14 - 1)
        return CommonApi.constrain(Math.ceil(point / div), 0, pointTypeTierCountDic.rank14 - 1)
        break
      case 'score':
        if (point <= 0) {
          return 0
        } else if (point >= 100) {
          return pointTypeTierCountDic.point
        } else {
          return Math.round(point / 10)
        }
      case 'point':
        if (point <= 0) {
          return 0
        } else if (point >= 100) {
          return 100
        } else {
          return Math.round(point)
        }
      case 'unlimited':
        return Math.round(point)
    }
  }

  static calcAaverage (review: Review, reviewFactorParams: ReviewFactorParam[]) {
    let ave = 0
    let sumWeight = 0

    // 重みの合計を算出
    reviewFactorParams.forEach((param, index) => {
      if (param.isPoint && index < review.reviewFactors.length) {
        sumWeight += param.weight
      }
    })
    reviewFactorParams.forEach((param, index) => {
      if (param.isPoint && index < review.reviewFactors.length) {
        const factor = review.reviewFactors[index]
        if (factor.point !== undefined) {
          ave += factor.point * param.weight / sumWeight
        }
      }
    })
    return ave
  }

  static calcSum (review: Review, reviewFactorParams: ReviewFactorParam[]) {
    let sum = 0
    reviewFactorParams.forEach((param, index) => {
      if (param.isPoint && index < review.reviewFactors.length) {
        const factor = review.reviewFactors[index]
        if (factor.point !== undefined) {
          sum += factor.point
        }
      }
    })
    return sum
  }

  static getPointTypes (reviews: Review[]) : ReviewPointType[] {
    const pointTypes: ReviewPointType[] = []
    reviews.forEach((review) => {
      pointTypes.push(review.pointType || 'point')
    })
    return pointTypes
  }

  static makeTierPivot (reviews: Review[], reviewFactorParams: ReviewFactorParam[], tierId: string, pointType: ReviewPointType) {
    const len = pointTypeTierCountDic[pointType] as number | undefined
    const list: TierPivotInfomation[][] = []
    if (len) {
      // 器を用意する
      const step = 100 / (len - 1)
      for (let i = 0; i < len; i++) {
        list.push([])
      }

      // ポイントの段階ごとにグルーピングする
      reviews.forEach((review) => {
        const point = ReviewFunc.calcAaverage(review, reviewFactorParams)
        const index = list.length - Math.round(point / step) - 1

        if (index >= 0 && index < list.length) {
          list[index].push({
            reviewId: review.reviewId,
            point: ReviewFunc.calcAaverage(review, reviewFactorParams),
            iconUrl: review.iconUrl
          })
        }
      })
    }

    // ソートを実行する
    list.forEach((v, i) => {
      list[i] = v.sort((a, b) => a.point - b.point)
    })
    return list
  }
}
