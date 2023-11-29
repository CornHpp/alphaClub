type ResponsePagingType<T> = {
  code: string;
  message: string;
  result: ResponsepagingBase<T>;
};

type ResponsepagingBase<T> = {
  count: number;
  pageList: T[];
};

type ResponseBaseType<T> = {
  code: string;
  message: string;
  result: T;
};

type allSpaceResponse = {
  biddingEndTtime: string;
  imageUrl: string;
  maxSeatNumber: number;
  spaceBeginTime: string;
  title: string;
  seatStatus: number;
  price: number;
  priceStr: string;
  twitterName: string;
  twitterScreenName: string;
  twitterUid: string;
  sid: number;
  role: string;
};

type UserInfoType = {
  followersCount: number;
  imageUrl: string;
  twitterName: string;
  twitterScreenName: string;
  twitterUid: string | number;
  walletAddress: string;
  twitterUidStr: string;
};
