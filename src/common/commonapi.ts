
export default class CommonApi {
  /**
   * 日付型を文字列に変換する
   * @param date 日付
   * @param isDetail 時分秒を含むかどうか
   * @returns 日付の文字列
   */
  static dateToString (date: Date, isDetail?: boolean) : string {
    const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    return isDetail ? dateStr + ` ${CommonApi.padZero(date.getHours(), 2)}:${CommonApi.padZero(date.getMinutes(), 2)}:${CommonApi.padZero(date.getSeconds(), 2)}` : dateStr
  }

  /**
   * 指定した範囲を超えない数値を返す関数
   * @param n 数値
   * @param low 最低値
   * @param high 最高値
   * @returns 範囲内におさまる数値
   */
  static constrain (n: number, low: number, high: number) : number {
    if (n < low) {
      return low
    } else if (n > high) {
      return high
    } else {
      return n
    }
  }

  /**
   * 数値を指定した桁数に0埋めする
   * マイナスにも対応
   * 数値が指定した桁を上回る場合は、そのまま出力
   * @param n 対象の数値
   * @param len 0埋めを行う桁数
   * @returns 0埋めを行った文字列
   */
  static padZero (n: number, len: number) {
    if (len < 0) {
      throw new Error('0埋めを行う長さは0以上である必要があります')
    }

    let nstr : string = n.toString()
    let minsus : string
    if (n < 0) {
      nstr = nstr.substring(1, nstr.length)
      minsus = '-'
    } else {
      minsus = ''
    }

    if (nstr.length > len) {
      return minsus + nstr
    }
    return minsus + (('0'.repeat(len) + nstr).slice(-len))
  }
}
