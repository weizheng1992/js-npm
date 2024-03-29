// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import type { AxiosResponse } from 'axios';
import type { RequestOptions, Result } from './types';
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';

import { VAxios } from './Axios';
import { checkStatus } from './checkStatus';

import { RequestEnum, ContentTypeEnum,ResultEnum } from './httpEnum';

import { isString } from '../is';
import { setObjToUrlParams, deepMerge } from '../index';

import { createNow, formatRequestDate } from './helper';

import {getAppEnvConfig} from '../env'


/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据
   */
  transformRequestHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { isTransformRequestResult ,onError} = options;
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformRequestResult) {
      return res.data;
    }
    // 错误的时候返回
    const { data } = res;
    if (!data) {
      // return '[HTTP] Request has no return value';
      throw new Error('请求出错，请稍候重试')
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { data: result,code,msg:message } = data;

    // 这里逻辑可以根据项目进行修改
    const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS;
    if (hasSuccess) {
      return result;
    }

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let timeoutMsg = '';
    switch (code) {
      case ResultEnum.TIMEOUT:
        timeoutMsg = "请求超时";
        break;
      default:
        if (message) {
          timeoutMsg = message;
        }
    }

    // fn timeoutMsg ;
    onError&&onError(timeoutMsg)
   

    throw new Error(timeoutMsg || '请求出错，请稍候重试');
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinParamsToUrl, formatDate, joinTime = true } = options;

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, createNow(joinTime, false));
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${createNow(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        config.data = params;
        config.params = undefined;
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(config.url as string, config.data);
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config) => {
    // 请求之前处理config
    const token = localStorage.getItem('token');
    if (token&&config.headers) {
      // jwt token
      config.headers.Authorization = token;
    }
    return config;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: any,options:RequestOptions) => {
    const { code, message, response } = error || {};
    const {onError}=options;
    const msg: string = response?.data?.error?.message ?? '';
    const err: string = error?.toString?.() ?? '';
    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        // fn  msg '接口请求超时,请刷新页面重试'
        onError&&onError('接口请求超时,请刷新页面重试')
      }
      if (err?.includes('Network Error')) {
        // fn msg 网络异常
        onError&&onError('网络异常')
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
    onError&&checkStatus(error?.response?.status, msg,onError);
    return Promise.reject(error);
  },
};

export function createAxios(opt: CreateAxiosOptions) {
  const {URL} =getAppEnvConfig(opt.env)
  return new VAxios(
    deepMerge(
      {
        timeout: 10 * 1000,
        // 基础接口地址
        // 接口可能会有通用的地址部分，可以统一抽取出来
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 需要对返回数据进行处理
          isTransformRequestResult: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: false,
          // 消息提示类型
          // errorMessageMode: 'message',
          // 接口地址
          apiUrl: URL,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          onError:()=>{}
        },
      },
      opt || {}
    )
  );
}
// export const defHttp = createAxios();
// other api url
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: 'xxx',
//   },
// });
