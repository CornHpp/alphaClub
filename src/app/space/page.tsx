"use client";
import React, { useCallback, useEffect, useState } from "react";

import styles from "../space/index.module.scss";
import AlphaCard from "@/components/custom/inputCard";
import { Button } from "@/components/ui/button";
import { Input } from "antd-mobile";
import addIcon from "@/assets/images/createSpace/add.png";
import decreateIcon from "@/assets/images/createSpace/decreate.png";
import timepiece from "@/assets/images/home/timepiece.png";
import sofa from "@/assets/images/home/sofa.png";
import emptySeat from "@/assets/images/createSpace/emptySeat.png";
import arrowIcon from "@/assets/images/createSpace/arrow.png";
import Image, { StaticImageData } from "next/image";
import { NavBar } from "antd-mobile";
import { OrderMessage } from "@/components/custom/orderMessage";
import { useRouter } from "next/navigation";
import SearchView from "@/components/custom/searchView";
import { getBalance } from "@/service/userService";
import { Dialog } from "antd-mobile";
import { useSelector } from "react-redux";

import {
  createSpace,
  getSpaceDetail,
  spaceBidding,
  getSpaceOrderByspaceId,
} from "@/service/space";
import Toast from "@/components/custom/Toast/Toast";
import {
  TimePicker,
  getInitialDefaultValue,
  getNumberOfDaysInMonth,
} from "@/components/custom/TimePicker";

const parseTimeValue = (timeString: string) => {
  const [_, year, month, date, hour, minute] =
    timeString?.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):?(\d+)?/) ?? [];

  return {
    year,
    month,
    date,
    hour,
    minute,
  };
};

interface Iprops {
  detailId?: string;
}

const getBiddingTime = (time: string) => {
  const biddingTime = new Date(time).getTime() - 1 * 60 * 60 * 1000;
  const biddingDate = new Date(biddingTime);
  const [year, month, date, hour, minute] = [
    biddingDate.getFullYear(),
    biddingDate.getMonth() + 1,
    biddingDate.getDate(),
    biddingDate.getHours(),
    biddingDate.getMinutes(),
  ].map((x) => x.toString().padStart(2, "0"));

  return `${year}-${month}-${date} ${hour}:${minute}:00`;
};

const Space: React.FC<Iprops> = (props) => {
  const { detailId } = props;

  const initialBeginTimeValue = getInitialDefaultValue();
  const initialBeginTime = `${initialBeginTimeValue.year}-${initialBeginTimeValue.month}-${initialBeginTimeValue.date} ${initialBeginTimeValue.hour}:${initialBeginTimeValue.minute}`;
  const biddingEndTime = getBiddingTime(initialBeginTime);
  const [formMap, setFormMap] = useState({
    title: "",
    coHost: [],
    spaceSeatLimit: "",
    spaceBeginTime: initialBeginTime,
    biddingEndTime: biddingEndTime,
    maxSeatNumber: "",
    auctionPrice: "",
    BidPrice: "",
    web3Sid: "",
    supplyCount: "",
  });

  const { userinfo } = useSelector((state: any) => state.user);
  const [currentHostMap, setCurrentHostMap] = useState({
    twitterName: detailId ? "" : userinfo.twitterName,
    twitterScreenName: detailId ? "" : userinfo.twitterScreenName,
  });

  const [order, setOrder] = useState();
  const [showOrderMessage, setShowOrderMessage] = useState<boolean>(false);

  const [showStealSeatButton, setShowStealSeatButton] = useState<boolean>(true);
  const router = useRouter();

  const MemoAlphaCard = React.memo(AlphaCard);

  const [isFloatingSpaceOpen, setIsFloatingSpaceOpen] = React.useState(false);

  const [showSelectSearchView, setShowSelectSearchView] = React.useState(false);

  const [personalBalance, setPersonalBalance] = React.useState(0);

  const [joinPropleList, setJoinPropleList] = React.useState<{}[]>([]);

  const [isExistDetailByUserInfo, setIsExistDetailByUserInfo] = useState(false);

  const [selectedPeopleList, setSelectedPeopleList] = React.useState<
    UserInfoType[]
  >([]);
  // 判断当前的订单是否已经参加过了，或者是自己创建的，或者是co-host
  const isExistDetail = useCallback(
    (result: any) => {
      let status = false;
      result.joined?.forEach((item: any) => {
        console.log(item.twitterScreenName, userinfo.twitterScreenName);
        if (item.twitterScreenName == userinfo.twitterScreenName) {
          status = true;
        }
      });
      result.cohost?.forEach((item: any) => {
        if (item.twitterScreenName == userinfo.twitterScreenName) {
          status = true;
        }
      });
      if (result.host?.twitterScreenName == userinfo.twitterScreenName) {
        status = true;
      }
      console.log(status);
      setIsExistDetailByUserInfo(status);
    },
    [userinfo.twitterScreenName]
  );

  const getSpaceDetailFunc = useCallback(() => {
    getSpaceDetail(detailId).then((res: ResponseBaseType<any>) => {
      console.log(res);
      setFormMap({
        ...res.result,
        // Hard fix for backend typo
        biddingEndTime: res.result.biddingEndTtime ?? res.result.biddingEndTime,
        BidPrice: res.result.price,
      });
      setCurrentHostMap({
        twitterName: res.result.host.twitterName,
        twitterScreenName: res.result.host.twitterScreenName,
      });
      setSelectedPeopleList(res.result.cohost);
      var joinedArr = new Array(res.result.maxSeatNumber).fill({});
      res.result.joined?.forEach((item: any, index: number) => {
        joinedArr[index] = item;
      });

      isExistDetail(res.result);
      setJoinPropleList(joinedArr);
    });
  }, [detailId, isExistDetail]);

  useEffect(() => {
    if (detailId) {
      getSpaceDetailFunc();
    }
  }, [detailId, getSpaceDetailFunc]);

  const getPersonalBalance = () => {
    getBalance().then((res) => {
      setPersonalBalance(res.result);
    });
  };

  useEffect(() => {
    getPersonalBalance();
  }, []);

  const verfiyForm = () => {
    console.log("verfiyForm");
    if (!formMap.title) {
      Toast.error("Please enter a title");
      return false;
    }

    if (!formMap.spaceBeginTime) {
      Toast.error("Please enter a space beginning time");
      return false;
    }
    if (!formMap.biddingEndTime) {
      Toast.error("Please enter a bidding end time");
      return false;
    }
    if (!formMap.maxSeatNumber) {
      Toast.error("Please enter a bid number");
      return false;
    }

    return true;
  };

  const clickCreateSpace = () => {
    if (!verfiyForm()) return;
    if (personalBalance > 0.0001) {
      const param = {
        cohost: selectedPeopleList.map((item) => item.twitterUid),
        maxSeatNumber: Number(formMap.maxSeatNumber),
        spaceBeginTime: formMap.spaceBeginTime,
        biddingEndTtime: formMap.biddingEndTime,
        title: formMap.title,
      };
      createSpace(param).then((res) => {
        console.log(res);
        router.push("/myspace");
        // setOrder(res.result);
        // setShowOrderMessage(true);
      });
    } else {
      Dialog.confirm({
        getContainer: () => document.getElementById("root") as HTMLElement,
        bodyClassName: styles.dialogBody,
        content:
          "You must maintain a minimum balance of 0.0001 Eth in your account.",
        onConfirm: async () => {
          router.push("/earning");
        },
        onCancel: () => {
          console.log("onCancel");
        },
        cancelText: "Cancel",
        confirmText: "Confirm",
      });
    }
  };

  const getOrderMessageBySpaceId = () => {
    getSpaceOrderByspaceId(detailId).then((res) => {
      setOrder(res.result);
      setShowOrderMessage(true);
    });
  };

  const clickStealSeat = () => {
    console.log("clickStealSeat");
    getOrderMessageBySpaceId();
  };

  const clickSelectPeopleConfirm = (item: UserInfoType[]) => {
    console.log(item, userinfo.twitterName);
    item.forEach((i) => {
      const index = selectedPeopleList.findIndex((item) => {
        return item.twitterUid === i.twitterUid;
      });
      if (index === -1 && i.twitterScreenName !== userinfo.twitterScreenName) {
        selectedPeopleList.push(i);
      }
    });
    setSelectedPeopleList([...selectedPeopleList]);
    setShowSelectSearchView(false);
  };

  const clickCompleteStealSeat = () => {
    console.log("clickCompleteStealSeat");
    const data = {
      web3Sid: Number(formMap.web3Sid),
      price: Number(formMap.BidPrice),
    };
    spaceBidding(data).then((res) => {
      console.log(res);
      if (res.message === "success") {
        setShowStealSeatButton(false);
        setShowOrderMessage(false);
        router.push(`/buySuccess`);
        // getSpaceDetailFunc();
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className="pcWidth">
        <NavBar
          onBack={() => {
            router.back();
          }}
        >
          Space
        </NavBar>
        <div className={styles.formBox}>
          <AlphaCard
            title={"Title"}
            rightChildren={
              <Input
                value={formMap?.title}
                disabled={detailId ? true : false}
                onChange={(value) => {
                  setFormMap({
                    ...formMap,
                    title: value,
                  });
                }}
                placeholder="Please enter a title"
              />
            }
          ></AlphaCard>
          <MemoAlphaCard
            title={"Host"}
            rightChildren={currentHostMap.twitterName}
          >
            <div className={styles.content}>
              @{currentHostMap.twitterScreenName}
            </div>
          </MemoAlphaCard>

          <div className={styles.coHostBox}>
            <AlphaCard
              className={styles.setZindex}
              title={"Co-Host"}
              rightChildren={
                <CoHostAdd
                  detailId={detailId}
                  coHostUserEdit={() => {
                    // 如果是详情页，不允许添加
                    if (detailId) return;
                    setShowSelectSearchView(!showSelectSearchView);
                  }}
                ></CoHostAdd>
              }
            >
              <CoHostList
                CoHostUserDelete={(twitterUid) => {
                  console.log("CoHostUserEdit");
                  // 如果是详情页，不允许删除
                  if (detailId) return;
                  const index = selectedPeopleList.findIndex(
                    (item) => item.twitterUid === twitterUid
                  );
                  selectedPeopleList.splice(index, 1);
                  setSelectedPeopleList([...selectedPeopleList]);
                }}
                list={selectedPeopleList}
              ></CoHostList>
            </AlphaCard>
            {showSelectSearchView && (
              <div className={styles.searchView}>
                <SearchView
                  hideSearchView={() => {
                    setShowSelectSearchView(false);
                  }}
                  selectedPeople={(value) => {
                    clickSelectPeopleConfirm(value);
                  }}
                ></SearchView>
              </div>
            )}
          </div>

          <AlphaCard
            title={speceTime(sofa, "Space Seat Limit")}
            rightChildren={
              <Input
                type="number"
                disabled={detailId ? true : false}
                value={formMap?.maxSeatNumber}
                onChange={(value) => {
                  if (value && Number(value) > 7) {
                    Toast.error("The maximum number of bids is (1-7)");
                    return;
                  }
                  if (value && Number(value) < 1) {
                    Toast.error("The minimum number of bids is (1-7)");
                    return;
                  }
                  setFormMap({
                    ...formMap,
                    maxSeatNumber: value,
                  });
                }}
                placeholder="enter the seat limit(1-7)"
              />
            }
          ></AlphaCard>

          <MemoAlphaCard
            title={speceTime(timepiece, "Bidding End Time")}
            rightChildren={
              <TimePicker
                value={parseTimeValue(formMap.biddingEndTime)}
                onSelectTime={(timeValue) => {
                  setFormMap({
                    ...formMap,
                    biddingEndTime: timeValue,
                  });
                }}
                disabled={detailId ? true : false}
              />
            }
          />

          <MemoAlphaCard
            title={speceTime(timepiece, "Space Beginning Time")}
            rightChildren={
              <TimePicker
                value={parseTimeValue(formMap.spaceBeginTime)}
                onSelectTime={(timeString) => {
                  setFormMap({
                    ...formMap,
                    spaceBeginTime: timeString,
                  });
                }}
                disabled={detailId ? true : false}
              />
            }
          />

          {detailId && (
            <AlphaCard
              title={"Bid number"}
              rightChildren={
                <Input
                  disabled
                  value={formMap?.supplyCount + 1}
                  type="number"
                  onChange={(value) => {
                    if (Number(value) > 7) {
                      Toast.error("The maximum number of bids is 7");
                      return;
                    }
                    setFormMap({
                      ...formMap,
                      maxSeatNumber: value,
                    });
                  }}
                  placeholder="Please enter a bid number"
                />
              }
            ></AlphaCard>
          )}

          {detailId && (
            <MemoAlphaCard
              title={"Bid price "}
              rightChildren={`${formMap.BidPrice}ETH`}
            ></MemoAlphaCard>
          )}

          {detailId && <PeopleList list={joinPropleList}></PeopleList>}
        </div>

        {!detailId && (
          <div className={styles.createSpace}>
            <Button
              width={"90vw"}
              maxWidth="395px"
              height={"2.5rem"}
              onClick={clickCreateSpace}
            >
              Create
            </Button>
          </div>
        )}

        {detailId && !isExistDetailByUserInfo && (
          // { true && (
          <div className={styles.stealSpace}>
            <Button
              width={"90vw"}
              maxWidth="395px"
              height={"2.5rem"}
              onClick={clickStealSeat}
            >
              Steal the seat
            </Button>
          </div>
        )}

        <OrderMessage
          completeStealSeat={() => {
            clickCompleteStealSeat();
          }}
          transaction={order}
          hideSellOrbuy={() => {
            setShowOrderMessage(false);
            // getPersonalDetail();
          }}
          sellOrbuy={showOrderMessage}
        ></OrderMessage>
      </div>
    </div>
  );
};

export default Space;

interface ICoHostList {
  list: UserInfoType[];
  CoHostUserDelete: (id: number | string) => void;
}

const CoHostList: React.FC<ICoHostList> = ({ CoHostUserDelete, list }) => {
  return (
    <div className={styles.coHostListBox}>
      {list.length > 0 ? (
        list.map((item, index) => {
          return (
            <div
              key={index + "a"}
              className={[styles.content, styles.coHostItem].join(" ")}
            >
              <div>
                <div>{item?.twitterName}</div>
                <div>@{item?.twitterScreenName}</div>
              </div>
              <Image
                width={30}
                height={30}
                src={decreateIcon}
                className={styles.decreate}
                alt=""
                onClick={() => {
                  CoHostUserDelete(item?.twitterUid);
                }}
              ></Image>
            </div>
          );
        })
      ) : (
        <div className={styles.noNore}>-- no more --</div>
      )}
    </div>
  );
};

type coHostAddType = {
  coHostUserEdit: () => void;
  detailId: string | undefined;
};

const CoHostAdd: React.FC<coHostAddType> = (props) => {
  const { coHostUserEdit, detailId } = props;
  const [value, setValue] = React.useState("");

  const [showSearchList, setShowSearchList] = React.useState(true);

  return (
    <div className={styles.coHostRightAddIcon}>
      {/* <Input
        value={value}
        onChange={(val) => {
          setValue(val);
        }}
        placeholder="Please add a co-host"
      /> */}
      <Image
        className={detailId ? styles.grid : ""}
        onClick={() => {
          coHostUserEdit();
          setShowSearchList(!showSearchList);
        }}
        src={addIcon}
        width={30}
        height={30}
        alt=""
      ></Image>

      {showSearchList && <div className={styles.searchList}></div>}
    </div>
  );
};

const speceTime = (img: StaticImageData, title: string) => {
  return (
    <div className="flex items-center text-sm">
      <Image width={21} height={20} className="mr-2" src={img} alt=""></Image>
      {title}
    </div>
  );
};

interface IPeopleList {
  list: Array<UserInfoType | any>;
}
const PeopleList: React.FC<IPeopleList> = ({ list }) => {
  const [arrowImageIndex, setArrowImageIndex] = useState(0);

  useEffect(() => {
    for (var i = 0; i < list.length; i++) {
      if (!list[i].imageUrl) {
        setArrowImageIndex(i);
        break;
      }
    }
  }, [list]);
  return (
    <div className={styles.peopleListBox}>
      {list.map((item, index) => {
        return (
          <div key={index + "a"} className={styles.peopleItem}>
            <Image
              className={styles.setImgSize}
              src={item?.imageUrl ? item?.imageUrl : emptySeat}
              alt=""
              width={40}
              height={40}
              style={{ borderRadius: "50%" }}
            />
            {index == arrowImageIndex && (
              <Image
                width={22}
                height={22}
                className={styles.arrowIcon}
                src={arrowIcon}
                alt=""
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
