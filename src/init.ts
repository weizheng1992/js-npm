import {createAxios} from './utils/axios'
import {VAxios} from './utils/axios/Axios'
import type {  CreateAxiosOptions } from './utils/axios/axiosTransform';

import { pay } from './pay';
import { PayTypeProps,PayAllProps } from './pay/payType';

import {setObjToUrlParams} from './utils'

// import * as ApiList from './api';
import * as ApiType from './api/model';

enum Api {
  courseDetail = '/vipcourse',
  payOrder = '/vipcourse/payorder',
}

class PaySdk {
  private static env: string;
  private static instance: PaySdk;
  private static axios :VAxios ;
  private constructor() {}
  static getEnv() {
    return this.env;
  }
  static init(env: string) {
    if (PaySdk.instance) return;
    PaySdk.instance = new PaySdk();
    this.env = env;
    this.axios = this.createAxiosFn()
  }
  static createAxiosFn(){
      const opts = {} as CreateAxiosOptions
       opts.env = this.env
      return createAxios(opts)
  }

  static pay(params: PayTypeProps) {
    this.checkEnv()
    PaySdk.env && pay(params);
  }
  static getCourseDetail( {
    params,
    onError,
  }: ApiType.ApiCourseDetail) : Promise<ApiType.ApiCourseDetailResult>  {
    this.checkEnv()
      return this.axios.get<ApiType.ApiCourseDetailResult>(
        {
          url: `${Api.courseDetail}/${params.courseCode}/${params.channelCode}`,
          params: { openid: params.openid, unionid: params.unionid },
        },
        { onError }
      );
  }
  static getPayorder({
    params,
    onError,
  }: ApiType.ApiPayOrderParams): Promise<PayAllProps> {
    this.checkEnv()
      return this.axios.get<PayAllProps>(
        {
          url: this.payOrderUrl(params),
        },
        { onError }
      );
  }
  static async payOrderType ({params, onError}: ApiType.ApiPayOrderParams){
    this.checkEnv();
      let data = await this.getPayorder({params, onError})
      this.pay({type:params.payType,...data})
  }

  private static payOrderUrl(params:ApiType.PayOrderParams){
    const baseUrl =`${Api.payOrder}/${params.openid}/${params.orderNo}/${params.payType}`
    return params.emi ?setObjToUrlParams(baseUrl,{emi:params.emi,userId:params.userId}):baseUrl
  }
  private static checkEnv(){
    if(this.env){
      throw new Error('Before using, you must use the init method!')
    }
  }
}

export default PaySdk;
