/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */
export const getErrorInfoByCodeStatus = (status: number): string => {
  let content = "";
  switch (status) {
    case 400:
      content = "Request failed! Please try again later";
      break;
    case 401:
      content = "Login failed! Please login again";
      break;
    case 403:
      content = "The current account has no access!";
      break;
    case 404:
      content = "The resource you are looking for does not exist!";
      break;
    case 405:
      content = "Incorrect request mode! Please try again later";
      break;
    case 408:
      content = "Request timed out! Please try again later";
      break;
    case 500:
      content = "Service exception!";
      break;
    case 502:
      content = "Gateway error!";
      break;
    case 503:
      content = "Service unavailable!";
      break;
    case 504:
      content = "gateway timeout!";
      break;
    default:
      content = "The system is abnormal. Contact the administrator!";
  }
  return content;
};

export const getErrorInfoByMessages = (message: string): string => {
  if (message === "Network Error") {
    message = "The back-end interface is improperly connected";
  } else if (message.includes("timeout")) {
    message = "The system interface request timed out";
  } else if (message.includes("Request failed with status code")) {
    message =
      "system interface" + message.substr(message.length - 3) + "abnormal";
  }
  return message;
};
