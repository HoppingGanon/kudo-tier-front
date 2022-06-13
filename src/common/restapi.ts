import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'

export interface TempSession {
  // eslint-disable-next-line camelcase
  session_id: string
  // eslint-disable-next-line camelcase
  code_challenge: string
}

export interface TwitterAuthCode {
  code: string
  state: string
}

export interface Session {
  jwt: string
}

export default class RestApi {
  static get <T, V> (uri: string, config?: AxiosRequestConfig<V> | undefined) : Promise<AxiosResponse<T>> {
    return axios.get<T>(uri, config)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getJwt () : Promise<AxiosResponse<any, any>> {
    return this.get('http://')
  }

  static getTempSession () : Promise<AxiosResponse<TempSession>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.get<TempSession, any>(`${process.env.VUE_APP_BACK_BASE_URI}/auth/tempsession`)
  }

  static getSession (code: string, tempSession: string) : Promise<AxiosResponse<Session>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.get<Session, any>(`${process.env.VUE_APP_BACK_BASE_URI}/auth/session`, {
      params: {
        code: code,
        temp_session: tempSession
      }
    })
  }
}
