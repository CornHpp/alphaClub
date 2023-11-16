import request from "./config/request";

export const getTwitterLink = async (): Promise<any> => {
  const url = "/open/x/oauth/request_token";
  const response = await request.get<any>(url, {}, { loading: true });
  return response;
};

export type infoType = {
  oauth_token: string;
  oauth_verifier: string;
};
export const verifyTwitterToken = async (info: infoType) => {
  const url = "/open/callback";
  const response = await request.get(url, info);

  return response;
};
