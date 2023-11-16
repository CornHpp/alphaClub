import http from "./http.interceptor";
import { ResultData, ReqConfig } from "./interface";

/**
 * 混入默认个性化配置
 * @param {*} config
 * @returns
 */
function mixinCustom(config: ReqConfig) {
  config.custom = Object.assign(
    {
      auth: true, // 接口请求是否需要token
      toast: true, // 接口报错是否给出toast提示
      loading: true, // 加载是否展示loading--否
    },
    config.custom || {}
  );
  return config;
}

/**
 * 格式化get请求url参数，将对象解析为字符串
 * @param {*} url
 * @param {*} params
 * @returns
 */
function urlFormater(url: any, params: any) {
  if (params) {
    const paramList = [];
    for (const key in params) {
      paramList.push(key + "=" + params[key]);
    }
    return url.indexOf("?") > -1
      ? url + "&" + paramList.join("&")
      : url + "?" + paramList.join("&");
  }
  return url;
}

const request = {
  // get查询
  get<T>(url: string, params?: object, config = {}): Promise<T> {
    config = mixinCustom(config);
    const path = urlFormater(url, params);
    return http.get(path, config);
  },

  // post提交
  post<T>(url: string, params?: object, config = {}): Promise<T> {
    config = mixinCustom(config);
    return http.post(url, params, config);
  },

  // put
  put<T>(url: string, params?: object, config = {}): Promise<ResultData<T>> {
    config = mixinCustom(config);
    return http.put(url, params, config);
  },

  // delete删除
  delete<T>(url: string, params?: object, config = {}): Promise<ResultData<T>> {
    config = mixinCustom(config);
    return http.delete(url, { ...params, ...config });
  },
};

export default request;
