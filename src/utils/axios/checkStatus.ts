/*
 * @Author: weizheng
 * @Date: 2021-07-05 11:21:48
 * @LastEditors: weizheng
 * @LastEditTime: 2021-07-18 15:12:56
 */

// import { useNavigate } from 'react-router-dom';

export function checkStatus(
  status: number,
  msg: string,
  onError: (msg: string) => void
): void {
  // const navigate = useNavigate();
  let tMsg: string = '';
  switch (status) {
    case 400:
      // fn msg`${msg}`);
      tMsg = msg;
      break;
    // 401: Not logged in
    case 401:
      // fn msg'用户没有权限（令牌、用户名、密码错误）!');
      localStorage.removeItem('token');
      tMsg = '用户没有权限（令牌、用户名、密码错误）!';
      // navigate('/login');
      break;
    case 403:
      // fn msg`用户得到授权，但是访问是被禁止的。!`);
      tMsg = '用户得到授权，但是访问是被禁止的。!';
      break;
    // 404请求不存在
    case 404:
      // fn msg'网络请求错误,未找到该资源!');
      tMsg = '网络请求错误,未找到该资源!';
      break;
    case 405:
      // fn msg'网络请求错误,请求方法未允许!');
      tMsg = '网络请求错误,请求方法未允许!';
      break;
    case 408:
      // fn msg'网络请求超时!');
      tMsg = '网络请求超时!';
      break;
    case 500:
      // fn msg'服务器错误,请联系管理员!');
      tMsg = '服务器错误,请联系管理员!';
      break;
    case 501:
      // fn msg'网络未实现!');
      tMsg = '网络未实现!';
      break;
    case 502:
      // fn msg'网络错误!');
      tMsg = '网络错误!';
      break;
    case 503:
      // fn msg'服务不可用，服务器暂时过载或维护!');
      tMsg = '服务不可用，服务器暂时过载或维护!';
      break;
    case 504:
      // fn msg'网络超时!');
      tMsg = '网络超时!';
      break;
    case 505:
      // fn msg'http版本不支持该请求!');
      tMsg = 'http版本不支持该请求!';
      break;
    default:
  }
  onError(tMsg);
}
