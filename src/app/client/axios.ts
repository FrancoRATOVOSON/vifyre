import axios, { AxiosError, AxiosResponse } from 'axios'

const apiClient = axios.create({
  baseURL: '/api'
})

export const postApi = async <D, T>(url: string, payload: D) => {
  // try {
  const { data } = await apiClient.post<D, AxiosResponse<T>>(url, payload)
  return data
  // } catch (error) {
  //   if (error instanceof AxiosError) {
  //     if (error.status === 404) return null
  //     if (error.status === 400) return null
  //   }
  //   throw error
  // }
}

export const getApi = async <T>(url: string) => {
  try {
    const { data } = await apiClient.get<unknown, AxiosResponse<T>>(url)
    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === 404) return null
      if (error.status === 400) return null
    }
    throw error
  }
}
