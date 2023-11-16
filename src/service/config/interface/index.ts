// * 列表排序
export enum ORDER_TYPE {
  reverse = 1, // 倒序
  positive = 2, // 正序
}

// * 分页
export enum PAGE {
  SIZE = 20, // 列表请求每页条数
}

// * 请求响应参数(不包含data)
export interface Result {
  code: string;
  msg: string;
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
  data?: T;
}

// * 分页响应data结果
export interface ResPage<T> {
  records: T[];
  current: number;
  size: number;
  total: number;
}

// 分页响应结果
export type ResultPageData = ResultData<ResPage<any>>;

// * 分页请求参数
export interface ReqPage {
  current: number;
  size: number;
}

// 请求自定config配置
export interface ReqCustomOfConfig {
  auth?: boolean; // 接口请求是否需要token
  toast?: boolean; // 接口报错是否给出toast提示
  loading?: boolean; // 加载是否展示loading--否
}

// 请求config
export interface ReqConfig {
  custom?: ReqCustomOfConfig;
  header?: any;
}

// * 登录
export interface LoginType {
  // 登录参数
  ReqLoginForm: {
    username?: string;
    password?: string;
    code?: string; // 验证码
    randomStr?: string;
    authCode?: string; // 钉钉登录-授权码
    corpId?: string; // 钉钉登录-企业组织coprId
  };
  // 登录接口返回
  ResLogin: {
    access_token: string;
    [x: string]: any;
  };
}

//*  面试
export interface InterviewType {
  // 面试列表参数
  ListParams: ReqPage & {
    timeoutNotSubmit?: boolean; // 是否提交
    basic?: string; // 搜索的值
    sortField?: string; // 排序规则
    order?: ORDER_TYPE;
  };
}
