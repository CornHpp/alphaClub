import request from "./config/request";
import { BlobStorageContainerName, BlobStorageURL } from "./config/appsettings";

export const uploadImage = async (
  file: FormData,
  conversation_id: string
): Promise<string> => {
  const url = "File/uploadfile";
  const options = {
    headers: {
      "Content-Type": "multipart/form-data",
      "conversation-id": conversation_id,
    },
  };
  return await request.post<string>(url, file, options);
};

export const uploadicon = async (file: FormData): Promise<string> => {
  const url = "File/uploadicon";
  const options = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return await request.post<string>(url, file, options);
};

export const fetchSASToken = async (): Promise<string> => {
  const url = "File/getsastoken";

  const options = {};
  const response = await request.get<string>(url, options);
  return response;
};

export const makeIconURLString = (userid: string, sasToken: string): string => {
  if (!userid || !sasToken) return "";
  return (
    BlobStorageURL +
    BlobStorageContainerName +
    "common/" +
    userid.toLowerCase() +
    "/icons/icon.png" +
    sasToken
  );
};

export const makePicURLString = (path: string): string => {
  // if (!conversationId || !sasToken || !date || !fileId) return;
  const sasToken = localStorage.getItem("Cheers-SASToken");
  return BlobStorageURL + BlobStorageContainerName + path + sasToken;
};

export const makePicURLStringToStore = (
  conversationId: string,
  date: Date,
  fileId: string
): string => {
  if (!conversationId || !date || !fileId) return "";
  return "chat/" + "test/" + fileId;
};
