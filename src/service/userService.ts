import request from "./config/request";
import {
  decryptWithPrivateKey,
  generateKeyPair,
  getPublicKeyPEM,
} from "./cryptoHelp";

export const fetchUserData = (): Promise<any> => {
  const res = request.get<any>(`User/getuser`);
  return res;
};

export const fetchSwapCardInfo = async (targetUser: string): Promise<any> => {
  const url = "Cheers/getswapinfo?targetUser=" + targetUser;

  return await request.get<any>(url);
};

export const fetchUserSetpreference = async (data: any) => {
  const url = "User/setpreference";

  return await request.post<any>(url, data);
};

export const CompleteOnboarding = async () => {
  const url = "User/completeonboarding";

  return await request.get<any>(url);
};

export const userSetuid = async (uid: string) => {
  const url = "User/setuid?uid=" + uid;
  return await request.get(url);
};

export const setUserCurrency = async (currency: any): Promise<string> => {
  const url = "User/setcurrency?currency=" + currency;
  return await request.get<string>(url);
};

export const exportWallet = async (): Promise<string> => {
  const keys = await generateKeyPair();
  const pubKey = getPublicKeyPEM(keys);
  const data = {
    encryptKey: pubKey,
  };

  const url = "/wallet/export";
  const res = await request.post<ResponseBaseType<string>>(url, data);
  const privateKey = await decryptWithPrivateKey(keys.privateKey, res.result);
  return privateKey;
};

export const logOut = async (): Promise<boolean> => {
  const url = "/Auth/logout";
  const result = await request.get<boolean>(url);
  return result;
};

export const enterCode = async (code: string): Promise<string> => {
  const url = "Redpocket/code?code=" + code;
  const result = await request.get<string>(url);
  return result;
};

export const getCode = async (): Promise<string> => {
  const url = "Redpocket/getcode";
  const result = await request.get<string>(url);
  return result;
};

export const pingLogin = async (): Promise<boolean> => {
  const url = "User/ping";
  const result = await request.get<boolean>(url);
  return result;
};

export const getBalance = (): Promise<ResponseBaseType<any>> => {
  const url = "/wallet/balance";
  const config = {
    custom: {
      loading: false,
    },
  };
  return request.get<ResponseBaseType<any>>(url, {}, config);
};

export const getMyEarned = (): Promise<ResponseBaseType<any>> => {
  const url = "/wallet/getMyEarned";

  return request.get<ResponseBaseType<any>>(url);
};

export const getUserInfo = (): Promise<ResponseBaseType<any>> => {
  const url = "/secret/users/getLogin";

  return request.get<ResponseBaseType<any>>(url, {});
};

// 查询是否被别人挤出来

export const spaceCheckStatus = (): Promise<ResponseBaseType<any>> => {
  const url = "/secret/space/check/status";

  const config = {
    custom: {
      loading: false,
    },
  };
  return request.get<ResponseBaseType<any>>(url, {}, config);
};

// 查询自己的邀请码
export const getInviteCode = (): Promise<
  ResponseBaseType<inviteCodeType[]>
> => {
  const url = "/secret/invite/get";
  return request.get<ResponseBaseType<inviteCodeType[]>>(url, {});
};

// 绑定邀请码
export const bindInviteCode = (
  inviteCode: string,
): Promise<ResponseBaseType<any>> => {
  const url = "/open/bind/invitecode";
  return request.post<ResponseBaseType<any>>(url, { inviteCode });
};
