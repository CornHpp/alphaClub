import request from "./config/request";

export const buyShares = async (
  targetUser: string,
  amount: number,
  buyPrice: number
): Promise<any> => {
  const url =
    "Cheers/buyshares?targetUser=" +
    targetUser +
    "&amount=" +
    amount +
    "&buyPrice=" +
    buyPrice;
  const response = await request.get<any>(url);
  return response;
};

export const getSharesOrder = async (
  targetUser: string,
  amount: number,
  action: string,
  buyPrice: number
): Promise<any> => {
  const url = "Cheers/getorder";
  const data: any = {
    targetId: targetUser,
    amount: amount,
    action: action,
    price: buyPrice,
  };
  const response = await request.post<any>(url, data);
  return response;
};

export const sellShares = async (
  targetUser: string,
  amount: number
): Promise<any> => {
  const url =
    "Cheers/sellshares?targetUser=" + targetUser + "&amount=" + amount;
  const response = await request.get<any>(url);
  return response;
};

export const fetchCheersHolders = async (
  targetUser: string,
  token: string
): Promise<number> => {
  const url = "Cheers/getholders?targetUser=" + targetUser;
  const options = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  const response = await request.get<number>(url, options);
  return response;
};

export const fetchCheersCard = async (
  from: string,
  to?: string
): Promise<any> => {
  const url = "Cheers/shareprofile?from=" + to + "&to=" + from;

  return await request.get<any>(url);
};

export const getCheersGetwallet = (): Promise<string> => {
  const url = "Cheers/getwallet";
  return request.get<string>(url);
};

// export const getCheersGetwallet = (): Promise<string> => {
//   const url = "Cheers/getwallet";
//   return request.get<string>(url);
// };
// getethbalancebyaddress
export const getEthBalance = (address: string): Promise<number> => {
  const url = "Cheers/getbalance?address=" + address;
  const options = {
    custom: {
      loading: false,
    },
  };
  return request.get<number>(url, {}, options);
};

export const getBuyPrice = (
  address: string,
  amount: number
): Promise<number> => {
  const url = "Cheers/buyprice?targetUser=" + address + "&amount=" + amount;
  return request.get<number>(url);
};

export const getSellPrice = (address: string): Promise<number> => {
  const url = "Cheers/getbalance?address=" + address;
  return request.get<number>(url);
};

export const sendEth = (wallet: string, amount: number): Promise<string> => {
  const url = "/wallet/transfer?wallet =" + wallet + "&amount=" + amount;
  return request.get<string>(url);
};
