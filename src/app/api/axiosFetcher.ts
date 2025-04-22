import { cookies } from 'next/headers';

import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface MakeHttpRequestProps {
  method: HttpMethod;
  url: string;
  data?: unknown;
  config?: AxiosRequestConfig;
}

export function createAxios(token: string) {
  const headers = new AxiosHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Requested-With',
  });
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return axios.create({
    baseURL: process.env.BACK_URL,
    headers: headers,
  });
}

const axiosFetcher = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    makeHttpRequest<T>({ method: 'GET', url, config }),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    makeHttpRequest<T>({ method: 'POST', data, url, config }),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    makeHttpRequest<T>({ method: 'PUT', data, url, config }),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    makeHttpRequest<T>({ method: 'PATCH', data, url, config }),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    makeHttpRequest<T>({ method: 'DELETE', url, config }),
};

async function makeHttpRequest<T>({
  method,
  url,
  config,
  data,
}: MakeHttpRequestProps): Promise<{
  data: T;
  status: number;
}> {
  let response: AxiosResponse<T>;

  const authToken = (await cookies()).get("access-token")
  const axios = createAxios(authToken?.value || "");

  switch (method) {
    case 'GET':
      response = await axios.get<T>(url, config);
      break;
    case 'POST':
      response = await axios.post<T>(url, data, config);
      break;
    case 'PUT':
      response = await axios.put<T>(url, data, config);
      break;
    case 'PATCH':
      response = await axios.patch<T>(url, data, config);
      break;
    case 'DELETE':
      response = await axios.delete<T>(url, config);
      break;
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }

  return {
    data: response.data,
    status: response.status,
  };
}

export default axiosFetcher;
