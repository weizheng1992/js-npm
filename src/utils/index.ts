import { isObject } from './is';

// 浏览器
export const inBrowser: boolean = typeof window !== 'undefined';

// 获取相关浏览器信息
export const UA: string | boolean =
  inBrowser && window.navigator.userAgent.toLowerCase();

// 是否微信浏览器
export const isWeChat: boolean = !!UA && /micromessenger/g.test(UA);

// 是否是钉钉
export const isPcDingTalkWS: boolean = !!UA && UA.indexOf('dingtalk') !== -1;

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key])
      ? deepMerge(src[key], target[key])
      : (src[key] = target[key]);
  }
  return src;
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl)
    ? baseUrl + parameters
    : baseUrl.replace(/\/?$/, '?') + parameters;
}
