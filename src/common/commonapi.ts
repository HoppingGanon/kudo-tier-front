
export default class CommonApi {
  static second = 1000
  static minute = CommonApi.second * 60
  static hour = CommonApi.minute * 60
  static day = CommonApi.hour * 24

  /**
   * 日付型を文字列に変換する
   * @param date 日付
   * @param isDetail 時分秒を含むかどうか
   * @returns 日付の文字列
   */
  static dateToString (date: Date, isDetail?: boolean, shortenDays?: number) : string {
    if (shortenDays !== undefined && shortenDays >= 0) {
      // 省略日数が指定されており、省略日付が指定されている場合
      const str = CommonApi.shortenDate(new Date(), date, shortenDays)
      if (str !== undefined) {
        return str
      }
    }

    const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    return isDetail ? dateStr + ` ${CommonApi.padZero(date.getHours(), 2)}:${CommonApi.padZero(date.getMinutes(), 2)}:${CommonApi.padZero(date.getSeconds(), 2)}` : dateStr
  }

  static shortenDate (nowDate: Date, date: Date, shortenDays: number) : string | undefined {
    const now = nowDate.getTime()
    const at = date.getTime()
    const distDay = (Math.floor((now - at) / CommonApi.day))

    if (distDay === 0) {
      const distHour = (Math.floor((now - at) / CommonApi.hour))
      if (distHour === 0) {
        const distMinute = (Math.floor((now - at) / CommonApi.minute))
        if (distMinute === 0) {
          // 1分以内なら秒表示
          const distSecond = (Math.floor((now - at) / CommonApi.second))
          return `${distSecond}秒前`
        } else {
          // 1時間以内なら分表示
          return `${distMinute}分前`
        }
      } else {
        // 1日以内なら時間表示
        return `${distHour}時間前`
      }
    } else if (distDay < shortenDays) {
      // 指定時間内なら省略表示
      return `${distDay}日前`
    }
    return undefined
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