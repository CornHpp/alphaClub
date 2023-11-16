import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

const baseURL = "http://localhost:3000";
const axioBackEnd = axios.create({ baseURL });

const handleError = (errorMsg: any) => {
  const { message, config = {} } = errorMsg;
  const { xsrfHearderName, xsrfCookieName } = config;

  if (message === "" || xsrfHearderName === "" || xsrfCookieName === "") {
    console.log("error here");
  }

  // toast.error(message);
};

const get = async (url: string, options?: any): Promise<any> => {
  return await axioBackEnd
    .get(url, options)
    .then((response) => response.data)
    .catch(handleError);
};

const post = async (url: string, data: object, options?: any): Promise<any> => {
  return await axioBackEnd
    .post(url, data, options)
    .then((response) => response.data)
    .catch(handleError);
};

const { defaults } = axioBackEnd;

export const backendHttp = {
  defaults,
  get,
  post,
};
