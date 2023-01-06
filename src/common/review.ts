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
export type ReviewDisplayType = 'summary' | 'list' | 'all'

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
  /** 項目番号、使用するのはTierをUpdateする場合のParams並び替え */
  index: number
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
  /** TierのアイコンURL */
  imageUrl: string

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

export const tierValidation = {
  /** Tier名の長さの上限 */
  tierNameLenMax: 100,
  /** 評価項目の合計数の上限 */
  paramsLenMax: 16,
  /** 評価項目名の文字数の上限 */
  paramNameLenMax: 16
}

export const reviewValidation = {
  /** Tier名の長さの上限 */
  nameLenMax: 50,
  /** Tier名の長さの上限 */
  titleLenMax: 100,
  /** 評価項目名の文字数の上限 */
  factorInfoLenMax: 16,
  /** セクションの最大数 */
  sectionLenMax: 8
}

export const sectionValidation = {
  /** セクションタイトルの文字数の上限 */
  sectionTitleLen: 100,
  /** 説明文の文字数の上限 */
  paragTextLenMax: 16,
  /** 説明文やリンクの合計数の上限 */
  paragsLenMax: 400,
  /** リンクの文字数の長さの上限 */
  paragLinkLenMax: 100
}

export interface TierEditingData {
  /** Tier識別ID 新規作成の際は空文字 */
  tierId: string

  /** Tierの名称 */
  name: string
  /** TierのアイコンURL */
  imageBase64: string | undefined

  /** 本文 */
  parags: ReviewParagraph[]

  /** レビューポイントの表示方法 */
  pointType: ReviewPointType
  /** レビュー評点に対する情報 */
  reviewFactorParams: ReviewFactorParam[]
}

export interface ReviewEditingData {
  /** review識別ID 新規作成の際は空文字 */
  reviewId: string
  /** Tier識別ID */
  tierId: string

  /** レビューの表示タイトル */
  title: string
  /** 作品名や商品名 */
  name: string
  /** レビューのアイコンURL */
  iconBase64: string
  /** レビュー評点 */
  reviewFactors: ReviewFactor[]
  sections: ReviewSection[]
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
  review: Review
  point: number
}

export class ReviewFunc {
  static getReviewDisp (point: number, type :ReviewPointType) : number {
    if (!point) {
      return 0
    }
    let div = 100
    switch (type) {
      case 'stars':
        div = 100 / (pointTypeTierCountDic.stars - 1)
        return CommonApi.constrain(Math.round(point / div), 0, pointTypeTierCountDic.stars - 1)
      case 'rank7':
        div = 100 / (pointTypeTierCountDic.rank7 - 1)
        return CommonApi.constrain(Math.round(point / div), 0, pointTypeTierCountDic.rank7 - 1)
      case 'rank14':
        div = 100 / (pointTypeTierCountDic.rank14 - 1)
        return CommonApi.constrain(Math.round(point / div), 0, pointTypeTierCountDic.rank14 - 1)
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

  /** 重みを考慮した評点の総合評価を算出する */
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

  /** 重みを考慮した評点の単純合計を算出する(unlimitedのみ) */
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

  /**
   * レビュー配列から、ポイント表示形式のみを取り出して配列化する
   * @param reviews レビュー配列
   * @returns ポイント表示形式配列
   */
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
        // rankやscoreについては、getReviewDisp()の機能と同様
        const index = list.length - Math.round(point / step) - 1

        if (index >= 0 && index < list.length) {
          list[index].push({
            review: review,
            point: ReviewFunc.calcAaverage(review, reviewFactorParams)
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

  /**
   * ReviewFactor[]をクローンする
   * @param factors クローンしたいデータ
   * @returns 別オブジェクトで内容が同一のクローン
   */
  static cloneFactors (factors: ReviewFactor[]) {
    const clone = [] as ReviewFactor[]
    factors.forEach((v) => {
      const child = {} as ReviewFactor
      // キーの有無も同一になるように複製する
      Object.keys(v).forEach((key) => {
        (child as Dictionary<string>)[key] = (v as Dictionary<string>)[key]
      })
      clone.push(child)
    })
    return clone
  }

  /**
   * ReviewParagraph[]をクローンする
   * @param org クローンしたいデータ
   * @returns 別オブジェクトで内容が同一のクローン
   */
  static cloneParags (org: ReviewParagraph[]) : ReviewParagraph[] {
    const clone = [] as ReviewParagraph[]
    org.forEach((v) => {
      clone.push({
        type: v.type,
        body: v.body
      } as ReviewParagraph)
    })

    return clone
  }

  /**
   * ReviewSection[]をクローンする
   * @param org クローンしたいデータ
   * @returns 別オブジェクトで内容が同一のクローン
   */
  static cloneSections (org: ReviewSection[]) : ReviewSection[] {
    const clone = [] as ReviewSection[]
    org.forEach((v) => {
      clone.push({
        title: v.title,
        parags: ReviewFunc.cloneParags(v.parags)
      } as ReviewSection)
    })

    return clone
  }

  /**
   * Reviewをクローンする
   * @param org クローンしたいデータ
   * @returns 別オブジェクトで内容が同一のクローン
   */
  static cloneReview (org: Review) : Review {
    const clone: Review = {
      reviewId: org.reviewId,
      userName: org.userName,
      userId: org.userId,
      userIconUrl: org.userIconUrl,
      tierId: org.tierId,
      title: org.title,
      name: org.name,
      iconUrl: org.iconUrl,
      reviewFactors: ReviewFunc.cloneFactors(org.reviewFactors),
      sections: ReviewFunc.cloneSections(org.sections),
      createAt: org.createAt,
      updateAt: org.updateAt
    }

    // ポイント表示形式のキー有無も同一にする
    if ('pointType' in org) {
      clone.pointType = org.pointType
    }

    return clone
  }

  /**
   * Review[]をクローンする
   * @param org クローンしたいデータ
   * @returns 別オブジェクトで内容が同一のクローン
   */
  static cloneReviews (org: Review[]) : Review[] {
    const clone = [] as Review[]
    org.forEach((v) => {
      clone.push(ReviewFunc.cloneReview(v))
    })
    return clone
  }

  /**
   * ReviewFactorParam[]をクローンする
   * @param org クローンしたいデータ
   * @returns 別オブジェクトで内容が同一のクローン
   */
  static cloneFactorParams (org: ReviewFactorParam[]) : ReviewFactorParam[] {
    const clone = [] as ReviewFactorParam[]
    org.forEach((v) => {
      clone.push({
        name: v.name,
        isPoint: v.isPoint,
        weight: v.weight,
        index: v.index
      })
    })
    return clone
  }

  /**
   * Tierをクローンする
   * @param org クローンしたいデータ
   * @returns 別オブジェクトで内容が同一のクローン
   */
  static cloneTier (org: Tier) : Tier {
    const clone: Tier = {
      tierId: org.tierId,
      userName: org.userName,
      userId: org.userId,
      userIconUrl: org.userIconUrl,
      name: org.name,
      imageUrl: org.imageUrl,
      parags: ReviewFunc.cloneParags(org.parags),
      reviews: ReviewFunc.cloneReviews(org.reviews),
      pointType: org.pointType,
      reviewFactorParams: ReviewFunc.cloneFactorParams(org.reviewFactorParams),
      createAt: org.createAt,
      updateAt: org.updateAt
    }

    return clone
  }

  /**
   * DataURLからbase64形式のテキストのみ抜き出す DataURLがbase64形式出ない場合はエラー
   * @param v DataURL
   * @returns base64
   */
  static dataURLToBase64 (v: string) : string {
    if (v === '') {
      return v
    }
    const splitedStr = v.split(',')
    if (splitedStr.length > 1 && splitedStr[0].includes('base64')) {
      return splitedStr[1]
    } else {
      return 'nochange'
    }
  }

  /**
   * Tierからリクエストデータを生成する
   * @param tier 生成元Tier
   * @param tierId Tierの固有ID (新規作成の際は空文字)
   * @returns リクエストデータ
   */
  static createTierRequestData (tier: Tier, tierId: string) : TierEditingData {
    return {
      tierId: tierId,
      name: tier.name,
      imageBase64: ReviewFunc.dataURLToBase64(tier.imageUrl),
      parags: ReviewFunc.cloneParags(tier.parags),
      pointType: tier.pointType,
      reviewFactorParams: ReviewFunc.cloneFactorParams(tier.reviewFactorParams)
    }
  }

  /**
   * レビューからリクエストデータを生成する
   * @param review 生成元Tier
   * @param reviewId レビューの固有ID (新規作成の際は空文字)
   * @returns リクエストデータ
   */
  static createReviewRequestData (review: Review, tierId: string, reviewId: string) : ReviewEditingData {
    return {
      reviewId: reviewId,
      tierId: tierId,
      title: review.title,
      name: review.name,
      iconBase64: ReviewFunc.dataURLToBase64(review.iconUrl),
      reviewFactors: ReviewFunc.cloneFactors(review.reviewFactors),
      sections: ReviewFunc.cloneSections(review.sections)
    }
  }
}
