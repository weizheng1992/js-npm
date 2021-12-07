export interface PayProps {
  orderNo: string;
  payUrl: string;
  openid: string;
  webUrl: string;
}
export interface StagesPayProps {
  payUrl: string;
  userId: string;
  emi: string;
}

export interface WxH5Props {
  appId?: string; //公众号名称，由商户传入
  timeStamp?: string; //时间戳，自1970年以来的秒数
  nonceStr?: string; //随机串
  package?: string;
  packageValue?: string;
  signType?: string; //微信签名方式：
  paySign?: string; //微信签名
  orderNo?: string;
  redirectUrl?: string;
  mwebUrl?: string;
}

export interface h5WxProps {
  payUrl?: string;
  mwebUrl?: string;
}

export type PayAllProps = PayProps | WxH5Props | StagesPayProps;

export interface ActionsType {
  type: number | number[];
  fn: (params: PayAllProps) => void;
}

export type PayType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 13 | 16 | 22;

export type PayTypeProps = {
  type: PayType;
} & PayAllProps;
