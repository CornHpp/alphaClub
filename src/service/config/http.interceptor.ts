import axios from "axios";
import { showFullScreenLoading, hideFullScreenLoading } from "./serviceLoading";
import { getErrorInfoByCodeStatus } from "./checkStatus";
import toast from "@/components/custom/Toast/Toast";

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";

// 创建axios实例
export const service = axios.create({
  // 默认请求地址

  baseURL:
    process.env.NODE_ENV === "development"
      ? "/api/"
      : process.env.NEXT_PUBLIC_APP_URL,
  // 超时
  // timeout: 0,
  // 跨域时候允许携带凭证
  withCredentials: true,
});

// request拦截器
service.interceptors.request.use(
  (config: any) => {
    // 根据custom参数中配置的是否需要显示loading
    if (config.custom && config.custom.loading === true) {
      if (config.url == "Auth/twitterlogin?") {
        showFullScreenLoading(
          "Just a moment, it is a little slow to log in for the first time",
        );
      } else {
        showFullScreenLoading();
      }
    }
    config.headers["Content-Type"] = "application/json;charset=utf-8";
    // 请求携带自定义token
    const token = localStorage.getItem("token");

    config.headers["Authorization"] = token;
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (res: any) => {
    // 未设置状态码则默认成功状态
    const code = res?.data?.code || 200;
    // 获取错误信息
    const msg = res?.data?.message || getErrorInfoByCodeStatus(code);

    // 二进制数据则直接返回
    const { responseType } = res.request;
    if (responseType === "blob" || responseType === "arraybuffer") {
      return res.data;
    }
    // 响应拦截进来隐藏loading效果，此处采⽤延时处理是合并loading请求效果，避免多次请求loading关闭⼜开启
    setTimeout(() => {
      if (res.config?.custom && res.config?.custom?.loading === true) {
        hideFullScreenLoading();
      }
    }, 200);

    if (code == "90001") {
      return Promise.reject(res);
    }

    if (code == "90004") {
      return Promise.reject(res);
    }

    if (code != 200) {
      console.error(`[${res.config.url}]: ` + msg);

      if (
        res.config.url == "/secret/users/getLogin?" ||
        res.config.url == "/secret/space/check/status?"
      ) {
        console.log("error");
        return {};
      }
      toast.warning(msg);
      return res.data;
      // return Promise.reject(res);s
    }
    return res.data;
  },
  (error) => {
    // 响应拦截进来隐藏loading效果，此处采⽤延时处理是合并loading请求效果，避免多次请求loading关闭⼜开启
    setTimeout(() => {
      if (error.config?.custom && error.config?.custom?.loading === true) {
        hideFullScreenLoading();
      }
    }, 200);

    if (
      error.config.url == "/secret/users/getLogin?" ||
      error.config.url == "/secret/space/check/status?"
    ) {
      console.log("error");

      return {};
    }

    // 展示错误信息
    const { data: { data = "", msg = "" } = {}, status } = error.response || {};
    const errorMsg = msg || data || getErrorInfoByCodeStatus(status);
    const isShowErrToast = error.config?.custom?.toast;

    if (isShowErrToast) {
      // 登录失败不提示失败信息
      if (status !== 424) {
        console.error(`[${error.config.url}]: ` + errorMsg);
        if (errorMsg && errorMsg != "") {
          toast.warning(errorMsg);
        }
        // location.href = `${location.origin}/404`;
      }
    }

    if (status == 401) {
      setTimeout(() => {
        localStorage.removeItem("token");
        location.href = `${location.origin}/`;
      }, 1000);
    }
    return Promise.reject(error);
  },
);

export default service;
