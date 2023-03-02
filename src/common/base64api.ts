import base64js from 'base64-js'

/**
 * Base64形式のデータを相互に変換する為のAPI
 */
export default class Base64Api {
  /**
   * 数値型配列(内部的にはInt32)をBase64文字列に変換する
   * @param val バッファ
   * @returns Base64文字列
   */
  static numbersToBase64 (val: number[]) : string {
    const u8buff = Base64Api.numbersToBytes(val)
    return Base64Api.bytesToBase64(u8buff)
  }

  /**
   * Base64文字列を数値型配列(内部的にはInt32)に変換する
   * @param val Base64文字列
   * @returns 数値型配列
   */
  static base64ToNumbers (val : string) : number[] {
    const numbuff = Base64Api.base64ToBytes(val)
    return Base64Api.bytesToNumbers(numbuff)
  }

  /**
   * ArrayBufferをBase64文字列に変換する
   * @param val ArrayBuffer
   * @returns Base64文字列
   */
  static BufferToBase64 (val : ArrayBuffer) : string {
    const b8array = new Uint8Array(val)
    return Base64Api.bytesToBase64(b8array)
  }

  /**
   * input等で取得したFileオブジェクトをBase64文字列に変換する
   * @param val Fileオブジェクト
   * @returns Base64文字列
   */
  static async FileToBase64 (val: File) : Promise<string> {
    const aBuff = await val.arrayBuffer()
    return Base64Api.BufferToBase64(aBuff)
  }

  /**
   * Base64文字列をFileオブジェクトに変換する
   * @param val Base64文字列
   * @returns Fileオブジェクト
   */
  static base64ToFile (val : string, name?: string, type?: string) : File {
    const bytes = Base64Api.base64ToBytes(val)
    if (name === undefined) {
      if (type === undefined) {
        return new File([bytes.buffer], 'noname')
      } else {
        return new File([bytes.buffer], 'noname', { type: type })
      }
    } else {
      if (type === undefined) {
        return new File([bytes.buffer], name)
      } else {
        return new File([bytes.buffer], name, { type: type })
      }
    }
  }

  /**
   * バイト配列をBase64文字列に変換する
   * @param val バイト配列
   * @returns Base64文字列
   */
  static bytesToBase64 (val : Uint8Array) : string {
    return base64js.fromByteArray(val)
  }

  /**
   * Base64文字列をバイト配列に変換する
   * @param val Base64文字列
   * @returns バイト配列
   */
  static base64ToBytes (val : string) : Uint8Array {
    return base64js.toByteArray(val)
  }

  /**
   * 8bit整数配列を数値型配列をに変換する
   * @param val 変換したい8bit整数配列
   * @returns 数値型配列
   */
  static bytesToNumbers (val : Uint8Array) : number[] {
    const numbuff = val.length % 4 === 0 ? Array<number>(Math.floor(val.length / 4)) : Array<number>(Math.floor(val.length / 4 + 1))
    val.forEach((v, i) => {
      switch (i % 4) {
        case 0:
          numbuff[Math.floor(i / 4)] = v << 24
          break
        case 1:
          numbuff[Math.floor(i / 4)] += v << 16
          break
        case 2:
          numbuff[Math.floor(i / 4)] += v << 8
          break
        case 3:
          numbuff[Math.floor(i / 4)] += v
          break
      }
    })
    return numbuff
  }

  /**
   * 数値型配列を8bit整数型配列に変換する
   * @param val 変換したい数値型配列
   * @returns 8bit整数配列
   */
  static numbersToBytes (val: number[]) : Uint8Array {
    const u8buff = new Uint8Array(val.length * 4)
    val.forEach((v, i) => {
      u8buff[i * 4] = v & 0xFF000000 >> 24
      u8buff[i * 4 + 1] = v & 0xFF0000 >> 16
      u8buff[i * 4 + 2] = v & 0xFF00 >> 8
      u8buff[i * 4 + 3] = v & 0xFF
    })
    return u8buff
  }

  static getFileUrl (file : File) : string {
    return window.URL.createObjectURL(file)
  }

  /**
   * DataURLからbase64形式のテキストのみ抜き出す DataURLがbase64形式出ない場合はエラー
   * @param v DataURL
   * @returns base64
   */
  static dataURLToBase64 (v: string) : { base64 :string, isChanged: boolean } {
    if (v === '') {
      return {
        base64: v,
        isChanged: true
      }
    }
    const splitedStr = v.split(',')
    if (splitedStr.length > 1 && splitedStr[0].includes('base64')) {
      return {
        base64: splitedStr[1],
        isChanged: true
      }
    } else {
      return {
        base64: v,
        isChanged: false
      }
    }
  }

  /**
   * DataURLかどうか
   * @param v DataURL
   * @returns データかどうか(true...base64, false...base64ではない, undefined...空文字列)
   */
  static isDataUrl (v: string) : 'base64' | 'blob' | 'link' | 'empty' {
    if (v === '') {
      return 'empty'
    }
    const splitedStr = v.split(',')
    if (splitedStr.length > 1 && splitedStr[0].includes('base64')) {
      return 'base64'
    }
    if (v.substring(0, Math.min(v.length, 5)) === 'blob:') {
      return 'blob'
    }
    return 'link'
  }
}
