import {
  useCallback, useEffect, useMemo, useState,
} from 'react'
import axios, { AxiosRequestConfig } from 'axios'
import { message as antdMessage } from 'antd'
import { signin } from '@Src/pages/Signin/utils'
import { Storage } from './storage'

export const cancelSource = axios.CancelToken.source()

interface TResponse<T> {
  data: T;
  message: string;
  status: number;
  success: boolean;
}

export interface PagedData<T> {
  current: number;
  pageSize: number;
  total: number;
  data: T[];
}

const axiosInstance = axios.create({
  baseURL: '/api/',
  withCredentials: true,
  headers: {},
})

axiosInstance.interceptors.request.use(({
  cancelToken,
  headers,
  ...config
}) => {
  const AuthKey = 'Authorization'
  return {
    // 自带 cancelToken 的就不覆盖
    cancelToken: cancelToken ?? cancelSource.token,
    headers: {
      ...headers,
      Authorization: headers[AuthKey] || Storage.get(AuthKey) || '',
    },
    ...config,
  }
})

type CustomAxiosRequestConfig = AxiosRequestConfig & {
  customConfig?: {
    /**
     * 是否在 服务端返回 401 时自动弹登录弹窗
     * @default true
     */
    signinOn401?: boolean;
  };
}

export const http = {
  request<T = any>({
    customConfig = {}, ...config
  }: CustomAxiosRequestConfig) {
    // 默认跳转登录
    const { signinOn401 = true } = customConfig
    return axiosInstance.request<TResponse<T>>(config).then((res) => {
      const {
        status, data,
      } = res.data
      let { message = '服务器忙' } = res.data
      if (status >= 200 && status < 300) {
        return data
      }
      switch (status) {
        // 401 Unauthorized
        case 401: {
          message = '请登录后操作'
          if (signinOn401) {
            signin('modal')
          }
          break
        }
        // 403 Forbidden
        case 403: {
          antdMessage.error('权限不足')
          break
        }
        // other error
        default:
          break
      }
      throw new Error(message)
    })
  },
  get<T = any>(url: string, config?: CustomAxiosRequestConfig) {
    return http.request<T>({
      ...config,
      url,
      method: 'get',
    })
  },
  delete<T = any>(url: string, config?: CustomAxiosRequestConfig) {
    return http.request<T>({
      ...config,
      url,
      method: 'delete',
    })
  },
  head<T = any>(url: string, config?: CustomAxiosRequestConfig) {
    return http.request<T>({
      ...config,
      url,
      method: 'head',
    })
  },
  options<T = any>(url: string, config?: CustomAxiosRequestConfig) {
    return http.request<T>({
      ...config,
      url,
      method: 'options',
    })
  },
  post<T = any>(url: string, config?: CustomAxiosRequestConfig) {
    return http.request<T>({
      ...config,
      url,
      method: 'post',
    })
  },
  put<T = any>(url: string, config?: CustomAxiosRequestConfig) {
    return http.request<T>({
      ...config,
      url,
      method: 'put',
    })
  },
  patch<T = any>(url: string, config?: CustomAxiosRequestConfig) {
    return http.request<T>({
      ...config,
      url,
      method: 'patch',
    })
  },
}

interface UseApiOptions<Args extends unknown[], T, S = T> {
  /**
   * 是否调用 api
   */
  enable?: boolean;
  /**
   * api 出错时是否弹出 message.error
   */
  toastError?: boolean;
  /**
   * 对 api().then 的结果执行管道
   *
   * ！！！不在依赖中, 不会响应变化
   */
  pipe?: (res: T) => S;
  /**
   * api 的参数
   */
  args?: Args;
}

interface UseApiReturnType<T> {
  loading: boolean;
  /**
   * api 报错消息
   */
  error: string;
  data: T | undefined;
  /**
   * 强制重新执行 api
   */
  update: () => Promise<T>;
}

function decodeOptions<Args extends unknown[], T>(options?: UseApiOptions<Args, T, T>): Required<UseApiOptions<Args, T, T>>
function decodeOptions<Args extends unknown[], T, S>(options?: UseApiOptions<Args, T, S>): Required<UseApiOptions<Args, T, S>>
function decodeOptions<Args extends unknown[], T, S = T>(options?: UseApiOptions<Args, T, S>) {
  const {
    enable = true,
    toastError = true,
    args = [],
    pipe = (res: T) => res,
  } = options || {}

  return {
    enable,
    toastError,
    pipe,
    args,
  }
}

export function useApi<Args extends unknown[], T>(factory: (...args: Args) => Promise<T>, options?: UseApiOptions<Args, T>): UseApiReturnType<T>
export function useApi<Args extends unknown[], T, S>(factory: (...args: Args) => Promise<T>, options?: UseApiOptions<Args, T, S>): UseApiReturnType<S>
export function useApi<Args extends unknown[], T, S = T>(factory: (...args: Args) => Promise<T>, options?: UseApiOptions<Args, T, S>): UseApiReturnType<S> {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<S | undefined>()

  const {
    enable, toastError, pipe, args,
  } = useMemo(() => decodeOptions(options), [options])

  const update = useCallback(() => {
    if (enable && factory) {
      setError('')
      setLoading(true)
      return factory(...args)
        .then((res) => {
          const piped = pipe(res)
          setData(piped)
          return piped
        })
        .finally(() => {
          setLoading(false)
        })
        .catch((err) => {
          setError((err as Error)?.message || '请稍后再试')
          throw err
        })
    }
    return Promise.reject(new Error('disabled'))
    // args 以 ...args 的形式处于 dependencyList 中, 因为我们使用时就是 ...args
    // pipe & afterUpdate 不在 DependencyList 中
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enable, factory, ...args])

  useEffect(() => {
    update().catch((err) => {
      // pass
    })
  }, [update])

  useEffect(() => {
    if (toastError && error) {
      antdMessage.error({
        content: error,
        key: error,
      })
    }
  }, [error, toastError])

  return {
    loading,
    error,
    data,
    update,
  }
}
