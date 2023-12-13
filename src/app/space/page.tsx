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
import SpacePopup from "@/components/custom/spacePopup";
import { parseTimeValue } from "@/lib/utils";
import {
  createSpace,
  getSpaceDetail,
  spaceBidding,
  getSpaceOrderByspaceId,
  sendTwitter,
} from "@/service/space";
import Toast from "@/components/custom/Toast/Toast";
import {
  TimePicker,
  getInitialDefaultValue,
  getNumberOfDaysInMonth,
} from "@/components/custom/TimePicker";
import { addHoursToTime, formatDate, utcToLocal } from "@/lib/utils";

interface Iprops {
  detailId?: string;
}

const getBiddingTime = (time: string) => {
  console.log(time);
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

  const initialEndTimeValue = getInitialDefaultValue();
  const biddingEndTime = `${initialEndTimeValue.year}-${initialEndTimeValue.month}-${initialEndTimeValue.date} ${initialEndTimeValue.hour}:${initialEndTimeValue.minute}:00`;
  const initialBeginTimeValue = getInitialDefaultValue(biddingEndTime);
  const biddingBeginTime = `${initialBeginTimeValue.year}-${initialBeginTimeValue.month}-${initialBeginTimeValue.date} ${initialBeginTimeValue.hour}:${initialBeginTimeValue.minute}:00`;

  const [formMap, setFormMap] = useState({
    title: "",
    coHost: [],
    spaceSeatLimit: "",
    biddingEndTime: biddingEndTime,
    spaceBeginTime: biddingBeginTime,
    maxSeatNumber: "",
    auctionPrice: "",
    BidPrice: "",
    web3Sid: "",
    supplyCount: "",
    ticker: "",
  });

  const { userinfo } = useSelector((state: any) => state.user);
  const [currentHostMap, setCurrentHostMap] = useState({
    twitterName: detailId ? "" : userinfo.twitterName,
    twitterScreenName: detailId ? "" : userinfo.twitterScreenName,
  });

  const [order, setOrder] = useState({
    biddingPrice: 0,
  });
  const [showOrderMessage, setShowOrderMessage] = useState<boolean>(false);

  const [showStealSeatButton, setShowStealSeatButton] = useState<boolean>(true);
  const router = useRouter();

  const MemoAlphaCard = React.memo(AlphaCard);

  const [isFloatingSpaceOpen, setIsFloatingSpaceOpen] = React.useState(false);

  const [showSpacePopup, setShowSpacePopup] = React.useState(false);
  const [nowShowPopupCurrent, setNowShowPopupCurrent] = useState<number>(1); // 1: create success 2:create/bidding error 3:steal success

  const [showSelectSearchView, setShowSelectSearchView] = React.useState(false);

  const [personalBalance, setPersonalBalance] = React.useState(0);

  const [joinPropleList, setJoinPropleList] = React.useState<{}[]>([]);

  const [isExistDetailByUserInfo, setIsExistDetailByUserInfo] = useState(false);

  const [showSearchList, setShowSearchList] = useState(false);

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
    [userinfo.twitterScreenName],
  );

  const getSpaceDetailFunc = useCallback(() => {
    getSpaceDetail(detailId).then((res: ResponseBaseType<any>) => {
      console.log(res);
      setFormMap({
        ...res.result,
        // Hard fix for backend typo
        biddingEndTime: res.result.biddingEndTtime ?? res.result.biddingEndTime,
        BidPrice: res.result.priceStr,
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
    if (!formMap.ticker) {
      Toast.error("Please enter a ticker");
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
        cohost: selectedPeopleList.map((item) => item.twitterUidStr),
        maxSeatNumber: Number(formMap.maxSeatNumber),
        biddingEndTtime: utcToLocal(
          new Date(formMap.biddingEndTime).toISOString(),
        ),
        spaceBeginTime: utcToLocal(
          new Date(formMap.spaceBeginTime).toISOString(),
        ),
        title: formMap.title,
        ticker: formMap.ticker,
      };
      createSpace(param)
        .then((res) => {
          console.log(res);
          setNowShowPopupCurrent(1);
          setShowSpacePopup(true);
        })
        .catch((err) => {
          console.log(err);
          // setNowShowPopupCurrent(2);
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
    if (item.length == 0) {
      Toast.info("co-host is not selected");
      return;
    }
    setShowSearchList(false);

    item.forEach((i) => {
      const index = selectedPeopleList.findIndex((item) => {
        return item.twitterUidStr === i.twitterUidStr;
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
      price: Number(order.biddingPrice),
    };
    spaceBidding(data)
      .then((res) => {
        console.log(res);
        setShowStealSeatButton(false);
        setShowOrderMessage(false);
        setNowShowPopupCurrent(3);
        setShowSpacePopup(true);
      })
      .catch((err) => {
        console.log(err);
        if (err.data.code == "90001") {
          Toast.error("Price has changed, retriving new price.");
          getSpaceDetailFunc();
          setShowOrderMessage(false);
        } else {
          // setShowSpacePopup(true);
          // setNowShowPopupCurrent(2);
          setShowOrderMessage(false);
        }
      });
  };

  const clickMakeTwitter = () => {
    const alphaClubUrl = "https://tryalpha.club/space/" + detailId;
    let str =
      `I have just got my seat at << ${formMap.title} >>\nCome and join the room, either earn ETH, or earn $ALPHA!! \nThere's something for everyone to win @tryalpha_club #AlphaClub` +
      "\n \n " +
      `${alphaClubUrl}` +
      "\n \n ";
    if (nowShowPopupCurrent == 1 || nowShowPopupCurrent == 2) {
      str =
        `I will be hosting a space in alpha club, ${formMap.title}, come and join my space, lets bid to earn and enjoy the space. #AlphaClub #SlidingBids` +
        "\n \n " +
        `${alphaClubUrl}` +
        "\n \n ";
    }

    sendTwitter(str).then((res) => {
      console.log(res);
      // 如果是创建成功的弹窗，跳转到我的空间页面
      if (nowShowPopupCurrent == 1) {
        router.push("/myspace");
      }
      Toast.success("Twitter sent successfully");
      setShowSpacePopup(false);
    });
  };

  return (
    <div className={styles.container}>
      <div className="pcWidth">
        <NavBar
          className={styles.navBar}
          onBack={() => {
            router.back();
            router.push("/home");
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

          <AlphaCard
            title={"Ticker($)"}
            titleColor={"rgba(0, 111, 255, 1)"}
            rightChildren={
              <Input
                className={styles.tickerInput}
                value={formMap?.ticker}
                disabled={detailId ? true : false}
                onChange={(value) => {
                  setFormMap({
                    ...formMap,
                    ticker: value,
                  });
                }}
                placeholder="What Coin are you talking about? E.g. Ordi"
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
                  showSearchList={showSearchList}
                  setShowSearchList={setShowSearchList}
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
                CoHostUserDelete={(twitterUidStr) => {
                  console.log("CoHostUserEdit");
                  // 如果是详情页，不允许删除
                  if (detailId) return;
                  const index = selectedPeopleList.findIndex(
                    (item) => item.twitterUidStr === twitterUidStr,
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
                    setShowSearchList(false);
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
                    spaceBeginTime: addHoursToTime(timeValue, 1),
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
                hourLimit={1}
                startingTime={new Date(formMap.biddingEndTime)}
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
          }}
          sellOrbuy={showOrderMessage}
        ></OrderMessage>
        <SpacePopup
          makeTwitter={() => {
            clickMakeTwitter();
          }}
          title={"success"}
          show={showSpacePopup}
          onClose={() => {
            if (nowShowPopupCurrent == 1) {
              router.push("/myspace");
            }
            if (nowShowPopupCurrent == 3) {
              router.push("/home");
            }
            setShowSpacePopup(false);
          }}
        >
          {nowShowPopupCurrent == 1 && (
            <div>
              You just created your space, you will earn the first{" "}
              <span> {formMap.maxSeatNumber}</span> people&apos;s seat price +{" "}
              7.5% from every transaction. Come join us @tryalpha_club and share
              your space on twitter!
            </div>
          )}
          {nowShowPopupCurrent == 2 && (
            <div>
              Blockchain is currently busy, please wait for a while and come
              back to check your space
            </div>
          )}
          {nowShowPopupCurrent == 3 && (
            <div>
              You have stolen {currentHostMap.twitterScreenName}&apos;s Seat,
              keep it till the end,or earn <span> {formMap.BidPrice}</span> ETH
              when your seat gets taken.
            </div>
          )}
        </SpacePopup>
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
                  CoHostUserDelete(item?.twitterUidStr);
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
  showSearchList: boolean;
  setShowSearchList: (value: boolean) => void;
};

const CoHostAdd: React.FC<coHostAddType> = (props) => {
  const { coHostUserEdit, detailId, showSearchList, setShowSearchList } = props;
  // const [value, setValue] = React.useState("");

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
          if (detailId) return;
          setShowSearchList(!showSearchList);
        }}
        src={!showSearchList ? addIcon : decreateIcon}
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
      <Image
        width={21}
        height={20}
        className="mr-2"
        src={img}
        alt=""
      ></Image>
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
          <div
            key={index + "a"}
            className={styles.peopleItem}
          >
            {index == arrowImageIndex ? (
              <div className={styles.lightRing}>
                <div className={styles.secondLinghtRing}>
                  <Image
                    className={`${styles.setImgSize} ${styles.peopleImgActive}`}
                    src={item?.imageUrl ? item?.imageUrl : emptySeat}
                    alt=""
                    width={40}
                    height={40}
                    style={{ borderRadius: "50%" }}
                  />
                </div>
              </div>
            ) : (
              <Image
                className={`${styles.setImgSize}`}
                src={item?.imageUrl ? item?.imageUrl : emptySeat}
                alt=""
                width={40}
                height={40}
                style={{ borderRadius: "50%" }}
              />
            )}

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
