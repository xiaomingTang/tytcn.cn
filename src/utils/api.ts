import { useCallback, useEffect, useState } from 'react'
import axios, { AxiosRequestConfig } from 'axios'
import { Storage } from './storage'

export const cancelSource = axios.CancelToken.source()

interface TResponse<T> {
  data: T;
  message: string;
  status: number;
  success: boolean;
}

const axiosInstance = axios.create({
  baseURL: '/api/',
  withCredentials: true,
  headers: {},
})

axiosInstance.interceptors.request.use((config) => ({
  // 自带 cancelToken 的就不覆盖
  cancelToken: cancelSource.token,
  ...config,
}))

axiosInstance.interceptors.response.use((res) => {
  const {
    status, data, message = '服务器忙',
  } = res.data as TResponse<any>
  if (status >= 200 && status < 300) {
    return data
  }
  throw new Error(message)
})

export const http = {
  request<T = any>({
    headers,
    ...config
  }: AxiosRequestConfig) {
    return axiosInstance.request({
      headers: {
        Authorization: Storage.get('Authorization') ?? '',
        ...headers,
      },
      ...config,
    }) as Promise<T>
  },
  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return axiosInstance.request({
      ...config,
      url,
      method: 'get',
    }) as Promise<T>
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return axiosInstance.request({
      ...config,
      url,
      method: 'delete',
    }) as Promise<T>
  },
  head<T = any>(url: string, config?: AxiosRequestConfig) {
    return axiosInstance.request({
      ...config,
      url,
      method: 'head',
    }) as Promise<T>
  },
  options<T = any>(url: string, config?: AxiosRequestConfig) {
    return axiosInstance.request({
      ...config,
      url,
      method: 'options',
    }) as Promise<T>
  },
  post<T = any>(url: string, config?: AxiosRequestConfig) {
    return axiosInstance.request({
      ...config,
      url,
      method: 'post',
    }) as Promise<T>
  },
  put<T = any>(url: string, config?: AxiosRequestConfig) {
    return axiosInstance.request({
      ...config,
      url,
      method: 'put',
    }) as Promise<T>
  },
  patch<T = any>(url: string, config?: AxiosRequestConfig) {
    return axiosInstance.request({
      ...config,
      url,
      method: 'patch',
    }) as Promise<T>
  },
}

/**
 * 警告⚠️⚠️⚠️: data 明明类型声明了 undefined, 但不知道为什么提示不出来, 使用时需谨记!!!
 * - pipe 不在 useEffect DependencyList 中(变化 **不会** 重新发送请求)
 * - ...args 在 useEffect DependencyList 中(变化 **会** 重新发送请求)
 * @param enable 是否执行 factory
 * @param factory common/utils/api.ts 里面类似的函数
 * @param pipe 对 factory 请求返回值进行处理, 并返回新的值
 * @param args factory 的参数
 * @returns factory 返回值 经过 pipe 处理后的值
 */
export function useApiWhen<Args extends unknown[], T, S>(
  enable: boolean,
  factory: (...args: Args) => Promise<T>,
  pipe: (data: T) => S,
  args: Args,
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<S | undefined>()
  const [t, setT] = useState(Date.now())
  const forceUpdate = useCallback(() => {
    setT(Date.now())
  }, [])

  useEffect(() => {
    if (enable && factory) {
      setError('')
      setLoading(true)
      factory(...args)
        .then((res) => {
          setData(pipe(res))
        })
        .finally(() => {
          setLoading(false)
        })
        .catch((err) => {
          setError((err as Error)?.message || '请稍后再试')
          console.error(err)
        })
    }
    // args 以 ...args 的形式处于 dependencyList 中, 因为我们使用时就是 ...args
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, enable, factory, ...args])

  return {
    loading,
    error,
    data,
    forceUpdate,
  }
}
