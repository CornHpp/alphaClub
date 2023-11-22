import request from "./config/request";

export const getAllSpace = (
  data: getAllSpaceType,
): Promise<ResponsePagingType<allSpaceResponse>> => {
  const url = "/secret/space/getAllSpace";

  return request.get<ResponsePagingType<allSpaceResponse>>(url, data);
};

export const getMySpace = (
  data: getMySpaceType,
): Promise<ResponsePagingType<allSpaceResponse>> => {
  const url = "/secret/space/getMySpace";

  return request.get<ResponsePagingType<allSpaceResponse>>(url, data);
};

export const createSpace = (
  data: createSpaceType,
): Promise<ResponseBaseType<any>> => {
  const url = "/secret/space/create";

  return request.post<ResponseBaseType<any>>(url, data);
};

export const getSpaceDetail = (
  spaceId: string | number | undefined,
): Promise<ResponseBaseType<any>> => {
  const url = "/secret/space/getDetail?spaceId=" + spaceId;
  return request.post<ResponseBaseType<any>>(url);
};

export const searchUserByUserName = (
  userName: string | number | undefined,
): Promise<ResponsePagingType<UserInfoType>> => {
  const url = "/secret/users/get?userName=" + userName;
  return request.post<ResponsePagingType<UserInfoType>>(url);
};

export const getSpaceOrderByspaceId = (
  spaceId: string | number | undefined,
): Promise<ResponseBaseType<any>> => {
  const url = "/secret/space/getSpaceOrder?spaceId=" + spaceId;

  return request.get<ResponseBaseType<any>>(url);
};

export const spaceBidding = (
  data: spaceBiddingType,
): Promise<ResponseBaseType<any>> => {
  const url = "/secret/space/bidding";
  return request.post<ResponseBaseType<any>>(url, data);
};

export const spaceCohostDecide = (
  data: spaceCoHostDecide,
): Promise<ResponseBaseType<any>> => {
  const url = "/secret/space/cohost/decide";
  return request.post<ResponseBaseType<any>>(url, data);
};

// 发送推特

export const sendTwitter = (text: string): Promise<ResponseBaseType<any>> => {
  const url = "/secret/twitter/send/message";
  return request.post<ResponseBaseType<any>>(url, { text });
};
