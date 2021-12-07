import { PayType } from '../pay/payType';

export interface EmiAmounts {
  emi: number;
  amount: number;
}

export interface payChannel {
  id: number;
  name: string;
  code: string;
  icon: string;
  cls: string;
  online: number;
  payType: PayType;
  sort: number;
  status: null | number;
  emiAmounts: null | EmiAmounts[];
}
export interface ApiCourseDetailResult {
  amount: number;
  bindMobile: number;
  bussinessId: number;
  canVipDiscount: number;
  channelCode: string;
  cheeseId: number;
  classStatus: number;
  copywriting: null | string;
  courseCode: string;
  courseId: number;
  courseName: string;
  courseType: number;
  friendCircleTitle: string;
  groupShareTitle: string;
  icon: string;
  itemId: number;
  itemSkuCode: string;
  md: number;
  memberUser: number;
  model: number;
  orderNo: null | string;
  payChannel: payChannel[];
  payStatus: number;
  price: number;
  protocolMode: number;
  protocolStatus: number;
  scholarship: number;
  scholarshipSwitch: number;
  shareCoverImage: string;
  shareDescription: string;
  siteShow: number;
  subjectId: number;
  type: number;
  used: number;
  validChannel: number;
  vipAmount: number;
  vipDiscount: number;
}

// ?openid=o0IXitx_lVGqIU0Q26qYojqv4pAs&unionid=ocPQA1dkMB11rqsgUEktzVjISuQk

type BaseParams<T> = {
  params: T;
  onError: (msg: string) => void;
};

export type ApiCourseDetail = BaseParams<ApiCourseDetailParams>;
export interface ApiCourseDetailParams {
  openid: string;
  unionid: string;
  channelCode: string;
  courseCode: string;
}

export interface PayOrderParams {
  openid: string;
  orderNo: string;
  payType: PayType;
  emi?: number;
  userId?:string;
}

export type ApiPayOrderParams = BaseParams<PayOrderParams>;
