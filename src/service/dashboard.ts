import request from "./config/request";

export const getRecommondationNova = async (high: number, low: number) => {
  const url = "/Recommondation/nova?high=" + high + "&low=" + low;

  return await request.get<any>(url);
};
export const getRecommondationHot = async () => {
  const url = "/Recommondation/hot";
  return await request.get<any>(url);
};
export const getRecommondationTop = async () => {
  const url = "/Recommondation/top";
  return await request.get<any>(url);
};

export const getRecommondationFollow = async () => {
  const url = "/Recommondation/follow";
  return await request.get<any>(url);
};

export const getRecommondationSubscribe = async () => {
  const url = "/Recommondation/subscribe";
  return await request.get<any>(url);
};
