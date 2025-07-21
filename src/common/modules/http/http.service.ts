import { Inject, Injectable } from '@nestjs/common';
import { HttpModuleOptions } from '@src/common/modules/http/http.interface';
import { MODULE_OPTIONS_TOKEN } from '@src/common/modules/http/http.module-definition';
import axios, { Axios, AxiosResponse, RawAxiosRequestHeaders } from 'axios';

@Injectable()
export class HttpService {
  private axiosInstance: Axios;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) options: HttpModuleOptions) {
    this.axiosInstance = axios.create(options);
  }

  async get<T>(url: string) {
    return this.axiosInstance.get<T>(url);
  }

  async post<T, D>(url: string, data: D) {
    return this.axiosInstance.post<T, AxiosResponse<T>, D>(url, data);
  }

  async put<T, D>(url: string, data: D) {
    return this.axiosInstance.put<T, AxiosResponse<T>, D>(url, data);
  }

  async patch<T, D>(url: string, data: D) {
    return this.axiosInstance.patch<T, AxiosResponse<T>, D>(url, data);
  }

  async delete<T>(url: string) {
    return this.axiosInstance.delete<T>(url);
  }

  configHeaders(
    header: keyof RawAxiosRequestHeaders,
    value: RawAxiosRequestHeaders[keyof RawAxiosRequestHeaders],
  ) {
    this.axiosInstance.defaults.headers.common[header] = value;
  }
}
