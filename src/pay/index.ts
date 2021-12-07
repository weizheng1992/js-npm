import { _AP } from '../utils/urlencode';
import { isWeChat } from '../utils';
import * as PayType from './payType';

const textUrl = 'https://wxtest.kaikeba.com/';
/**
 * @desc 支付宝支付
 *
 * @param {PayProps} { orderNo, payUrl, openId }
 */
function alipay({ orderNo, payUrl, openid }: PayType.PayProps): void {
  if (window.top) {
    // window.top.location.href = `${textUrl}alipay/${orderNo}?orderUrl=${_AP.a_encode(
    //   encodeURIComponent(payUrl)
    // )}&&openId=${openid}`;
    if (isWeChat) {
      window.top.location.href = `${textUrl}alipay/${orderNo}?orderUrl=${_AP.a_encode(
        encodeURIComponent(payUrl)
      )}&&openId=${openid}`;
    } else {
      window.top.location.href = payUrl;
    }
  }
}

/**
 * @desc  微信h5 支付
 *
 * @param {WxH5Props} params
 */
function wxH5(params: PayType.WxH5Props): void {
  const {
    appId,
    timeStamp,
    nonceStr,
    packageValue,
    signType,
    paySign,
  } = params;
  const par = {
    appId,
    timeStamp,
    nonceStr,
    package: packageValue,
    signType,
    paySign,
  };

  if (!isWeChat) {
    window.location.href = `${params.mwebUrl}&redirect_url=${textUrl}paysuccess?orderId=${params.orderNo}`;
  }
  if (typeof WeixinJSBridge !== 'undefined') {
    onBridgeReady(par);
    return;
  }

  if (document.addEventListener) {
    document.addEventListener(
      'WeixinJSBridgeReady',
      () => {
        onBridgeReady(par);
      },
      false
    );
    return;
  }

  if ((<any>window).attachEvent) {
    (<any>window).attachEvent('WeixinJSBridgeReady', () => {
      onBridgeReady(par);
    });
    (<any>window).attachEvent('onWeixinJSBridgeReady', () => {
      onBridgeReady(par);
    });
    return;
  }
}

// function h5toWx(params: h5WxProps): void {
//   if (!isWeChat) {
//     window.location.assign(`${params.mwebUrl}&redirect_url=${params.payUrl}`);
//   }
// }

function onBridgeReady(params: PayType.WxH5Props) {
  WeixinJSBridge.invoke('getBrandWCPayRequest', params, async (res: any) => {
    if (res.err_msg == 'get_brand_wcpay_request:ok') {
      //成功后跳转到支付成功页面
      // if (Number(sell) === 1 && model === 1) {
      //   window.location.href = `groupDepositSuccess?orderId=${params.orderNo}`;
      // } else {
      window.location.href = `${textUrl}paysuccess?orderId=${params.orderNo}`;
      // }
    }
  });
}

/**
 * @desc 京东支付
 *
 * @param {PayType.PayProps} { orderNo, payUrl, openId }
 */
function jdPay({ orderNo, webUrl, openid, payUrl }: PayType.PayProps) {
  if (isWeChat && payUrl) {
    window.location.href = payUrl;
  }
  if (window.top && webUrl) {
    window.top.location.href = `${textUrl}jdpay/${orderNo}?orderUrl=${_AP.a_encode(
      encodeURIComponent(webUrl)
    )}&&openId=${openid}`;
  }
}

/**
 * @desc  分期支付
 *
 * @param {PayType.StagesPayProps} { payUrl }
 */
function stafesPay({ payUrl }: PayType.StagesPayProps) {
  if (window.top) {
    window.top.location.href = payUrl;
  }
}

const actions: PayType.ActionsType[] = [
  {
    type: [0,22], // 支付宝 花呗
    fn: params => alipay(params as PayType.PayProps),
  },
  {
    type: [1, 13], // 微信
    fn: params => wxH5(params as PayType.WxH5Props),
  },
  {
    type: 16, // 京东
    fn: params => jdPay(params as PayType.PayProps),
  },
  {
    type: [5, 9], // 分期
    fn: params => stafesPay(params as PayType.StagesPayProps),
  },
];

export const pay = ({ type, ...params }: PayType.PayTypeProps) => {
  actions.find(item => {
    if (Array.isArray(item.type)) {
      item.type.includes(type) && item.fn(params);
    } else {
      item.type === type && item.fn(params);
    }
  });
};
