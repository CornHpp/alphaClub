type getAllSpaceType = {
  isTop?: boolean;
  pageNum: number;
  pageSize: number;
  title?: string;
};

type getMySpaceType = {
  joinedType?: string;
  pageNum: number;
  pageSize: number;
  queryKey?: string;
};

type createSpaceType = {
  biddingEndTtime: string;
  cohost: Array<number | string>;
  maxSeatNumber: number;
  sid?: number;
  spaceBeginTime: string;
  title: string;
};
type spaceBiddingType = {
  web3Sid: number;
  price: number;
};

type spaceCoHostDecide = {
  sid: number;
  flag: number;
};

type inviteCodeType = {
  inviteCode: string;
  invitedTwitterUid?: string | number;
};
