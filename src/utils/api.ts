import { useCallback, useEffect, useState } from 'react'
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
}) => ({
  // 自带 cancelToken 的就不覆盖
  cancelToken: cancelToken ?? cancelSource.token,
  headers: {
    Authorization: Storage.get('Authorization') ?? '',
    ...headers,
  },
  ...config,
}))

axiosInstance.interceptors.response.use((res) => {
  const {
    status, data,
  } = res.data as TResponse<any>
  let { message = '服务器忙' } = res.data as TResponse<any>
  if (status >= 200 && status < 300) {
    return data
  }
  switch (status) {
    // 401 Unauthorized
    case 401: {
      message = '请登录后操作'
      signin('modal')
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

export const http = {
  request<T = any>(config: AxiosRequestConfig) {
    return axiosInstance.request(config) as Promise<T>
  },
  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return http.request<T>({
      ...config,
      url,
      method: 'get',
    })
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return http.request<T>({
      ...config,
      url,
      method: 'delete',
    })
  },
  head<T = any>(url: string, config?: AxiosRequestConfig) {
    return http.request<T>({
      ...config,
      url,
      method: 'head',
    })
  },
  options<T = any>(url: string, config?: AxiosRequestConfig) {
    return http.request<T>({
      ...config,
      url,
      method: 'options',
    })
  },
  post<T = any>(url: string, config?: AxiosRequestConfig) {
    return http.request<T>({
      ...config,
      url,
      method: 'post',
    })
  },
  put<T = any>(url: string, config?: AxiosRequestConfig) {
    return http.request<T>({
      ...config,
      url,
      method: 'put',
    })
  },
  patch<T = any>(url: string, config?: AxiosRequestConfig) {
    return http.request<T>({
      ...config,
      url,
      method: 'patch',
    })
  },
}

interface Ret<T> {
  loading: boolean;
  error: string;
  data: T | undefined;
  update: () => Promise<void>;
}

/**
 * - pipe & afterUpdate 不在 useEffect DependencyList 中(变化 **不会** 重新发送请求)
 * - ...args 在 useEffect DependencyList 中(变化 **会** 重新发送请求)
 * @param enable 是否执行 factory
 * @param factory common/utils/api.ts 里面类似的函数
 * @param args factory 的参数
 * @param pipe 对 factory 请求返回值进行处理, 并返回新的值
 * @param afterUpdate factory 请求成功后的回调
 * @returns factory 返回值 经过 pipe 处理后的值
 */
export function useApiWhen<Args extends unknown[], T>(
  enable: boolean,
  factory: (...args: Args) => Promise<T>,
  args: Args,
): Ret<T>
export function useApiWhen<Args extends unknown[], T, S>(
  enable: boolean,
  factory: (...args: Args) => Promise<T>,
  args: Args,
  pipe: (res: T) => S,
  afterUpdate?: () => void,
): Ret<S>
export function useApiWhen<Args extends unknown[], T, S>(
  enable: boolean,
  factory: (...args: Args) => Promise<T>,
  args: Args,
  pipe?: (res: T) => S,
  afterUpdate?: () => void,
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<S | undefined>()

  const update = useCallback(() => {
    if (enable && factory) {
      setError('')
      setLoading(true)
      return factory(...args)
        .then((res) => {
          if (pipe) {
            setData(pipe(res))
          } else {
            setData(data)
          }
          if (afterUpdate) {
            afterUpdate()
          }
        })
        .finally(() => {
          setLoading(false)
        })
        .catch((err) => {
          setError((err as Error)?.message || '请稍后再试')
        })
    }
    return Promise.reject(new Error('disabled'))
    // args 以 ...args 的形式处于 dependencyList 中, 因为我们使用时就是 ...args
    // pipe & afterUpdate 不在 DependencyList 中
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enable, factory, ...args])

  useEffect(() => {
    update()
  }, [update])

  return {
    loading,
    error,
    data,
    update,
  }
}
