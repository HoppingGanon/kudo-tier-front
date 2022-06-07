import axios, { AxiosResponse } from 'axios'

export interface TempSession {
  Session: string
}

export default class RestApi {
  static get <T> (uri: string) : Promise<AxiosResponse<T>> {
    return axios.get<T>(uri)
  }

  static getJwt () : Promise<AxiosResponse<any, any>> {
    return this.get('http://')
  }

  static getTempSession () : Promise<AxiosResponse<TempSession>> {
    return this.get<TempSession>(`${process.env.VUE_APP_BACK_BASE_URI}/auth/tempsession`)
  }
}
