import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import store from '@/store'

export interface TempSession {
  // eslint-disable-next-line camelcase
  sessionId: string
  // eslint-disable-next-line camelcase
  codeChallenge: string
}

export interface TwitterAuthCode {
  code: string
  state: string
}

export interface Session {
  sessionId: string
  userId: string
  expiredTime: string
  twitterName: string
  /** 俗にいうTeittwrのユーザーID */
  twitterUserName: string
  iconUrl: string
  isNew: string
}

export interface InitUserData {
  name: string
  profile: string
  accept: boolean
}

export interface UserData {
  name: string
  profile: string
  /** Teittwrの表示名 */
  twitterName: string
  iconUrl: string
}

export default class RestApi {
  static get <T> (uri: string) : Promise<AxiosResponse<T>> {
    const sessionId = store.state.sessionId
    const config:AxiosRequestConfig = {
      headers: {
        sessionId: sessionId
      }
    }
    return axios.get<T>(`${process.env.VUE_APP_BACK_BASE_URI}${uri}`, config)
  }

  static post <T> (uri: string, data?: object) : Promise<AxiosResponse<T>> {
    const sessionId = store.state.sessionId
    const config:AxiosRequestConfig = {
      headers: {
        sessionId: sessionId
      }
    }
    return axios.post<T>(`${process.env.VUE_APP_BACK_BASE_URI}${uri}`, data, config)
  }

  static del <T> (uri: string) : Promise<AxiosResponse<T>> {
    const sessionId = store.state.sessionId
    const config:AxiosRequestConfig = {
      headers: {
        sessionId: sessionId
      }
    }
    return axios.delete<T>(`${process.env.VUE_APP_BACK_BASE_URI}${uri}`, config)
  }

  static getTempSession () : Promise<AxiosResponse<TempSession>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return axios.get<TempSession>(`${process.env.VUE_APP_BACK_BASE_URI}/auth/tempsession`)
  }

  static getSession (code: string, tempSessionId: string) : Promise<AxiosResponse<Session>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return axios.get<Session>(`${process.env.VUE_APP_BACK_BASE_URI}/auth/session`, {
      headers: {
        code: code,
        tempSessionId: tempSessionId
      }
    })
  }

  static delSession () : Promise<AxiosResponse<Session>> {
    return this.del('/auth/session')
  }

  static createUser (data: InitUserData) {
    return this.post('/user', data)
  }

  static getUserData (userId: string) {
    return this.get<UserData>('/user/' + userId)
  }
}
