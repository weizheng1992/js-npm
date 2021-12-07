export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;

export interface RequestOptions {
  // ost请求的时候添加参数到url
  joinParamsToUrl?: boolean;
  // 格式化提交参数时间
  formatDate?: boolean;
  //  需要对返回数据进行处理
  isTransformRequestResult?: boolean;
  // 默认将prefix 添加到url
  joinPrefix?: boolean;
  // 接口地址，如果保留为空，则使用默认APIRL
  apiUrl?: string;
  // 错误消息提示类型
  errorMessageMode?: ErrorMessageMode;
  // 是否添加时间戳
  joinTime?: boolean;
  ignoreCancelToken?: boolean;
  onError?: (msg: string) => void;
}
interface errorItem {
  message: string;
  code: number;
}

export interface Result<T = any> {
  code: number;
  type: 'success' | 'error' | 'warning';
  msg: string;
  data: T;
  errors: errorItem[];
}
