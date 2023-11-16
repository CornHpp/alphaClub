export const env = "prod";

export const BackendURL: string =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
    ? // ? "http://localhost:7260/"
      "/api"
    : // ? "https://cheersapi-stagging.azurewebsites.net/"
      "https://cheersapi-stagging.azurewebsites.net/";
      // "https://cheersapi-prod.azurewebsites.net/";
// export const BackendURL: string = "https://eczodex-webapi-staging.azurewebsites.net/"

export const HubURL = "hubs";

export const BlobStorageURL =
  "https://cheersstorageaccount.blob.core.windows.net/";

export const BlobStorageContainerName = "userstorageprod/";
// export const BlobStorageContainerName = "userstoragestagging/";


export const MaxLoadingImageRetries = 5;
