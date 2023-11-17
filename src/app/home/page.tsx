"use client";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./index.module.scss";
import SuperSpaceCard from "@/components/custom/superSpaceCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import headerImg from "@/assets/images/home/headerImg.png";
import { SearchOutline } from "antd-mobile-icons";
import SearchInput from "@/components/custom/searchInput";
import { useRouter } from "next/navigation";
import { RightOutline } from "antd-mobile-icons";
import { InfiniteScroll, Dialog, PullToRefresh } from "antd-mobile";
import { PullStatus } from "antd-mobile/es/components/pull-to-refresh";
import { getAllSpace, getMySpace, spaceCohostDecide } from "@/service/space";
import { getBalance } from "@/service/userService";
import { useSelector } from "react-redux";

const statusRecord: Record<PullStatus, string> = {
  pulling: "pull-down",
  canRelease: "Release the hand",
  refreshing: "loading...",
  complete: "ok",
};

const HometabsList = [
  {
    title: "TOP",
    key: "TOP",
  },
  {
    title: "NEW",
    key: "NEW",
  },
];

const mySpaceTabsList = [
  {
    title: "Created",
    key: "created",
  },
  {
    title: "Co-host",
    key: "cohost",
  },
  {
    title: "Join",
    key: "joined",
  },
];
type homeProps = {
  isMySpace: boolean;
};

type _selfParamsProps = {
  pageNum: number;
  pageSize: number;
  isTop?: boolean;
  queryKey?: string;
  joinedType?: string;
};

const Home: React.FC<homeProps> = (props) => {
  const { isMySpace } = props;

  const tabsList = isMySpace ? mySpaceTabsList : HometabsList;

  const getListFunction = isMySpace ? getMySpace : getAllSpace;
  const currentTab = isMySpace ? "created" : "TOP";

  let [nowTab, setNowTab] = useState(currentTab);
  const [showIcon, setShowIcon] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const router = useRouter();
  const { userinfo } = useSelector((state: any) => state.user);

  let [pageMap, setPageMap] = useState({
    pageNum: 1,
  });
  console.log("11111111111111111", pageMap.pageNum);
  const [queryKey, setQueryKey] = useState("");

  //获取首次渲染的数据
  const datalist = async (type?: string) => {
    const isInit = type === "refresh";
    isInit && (pageMap.pageNum = 1);
    const param: _selfParamsProps = {
      pageNum: pageMap.pageNum,
      pageSize: 10,
      queryKey,
    };
    console.log(param);
    isMySpace
      ? (param.joinedType = nowTab)
      : (param.isTop = nowTab === "TOP" ? true : false);
    return getListFunction(param).then((res) => {
      let { pageList = [], count = 0 } = res.result;
      pageList?.forEach((item: any) => {
        if (nowTab == "created") {
          item.role = "created";
        } else if (nowTab == "joined") {
          item.role = "joined";
        }
      });
      const newList = [...(isInit ? [] : data), ...(pageList ? pageList : [])];
      setData(newList);
      setHasMore(newList.length >= count ? false : pageList?.length > 0);
      pageMap.pageNum++;
    });
  };

  //首次展示的数据
  const [data, setData] = useState<allSpaceResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const getBalanceFunction = useCallback(() => {
    getBalance().then((res) => {
      setWalletBalance(res.result);
    });
  }, []);

  useEffect(() => {
    getBalanceFunction();
  }, [getBalanceFunction]);

  const goCreateSpace = () => {
    router.push("/createSpace");
  };

  const onClickDecideSpace = (sid: number, val: number) => {
    const dialogText =
      val == 1 ? "whether accect this space?" : "whether decline this space?";
    Dialog.confirm({
      getContainer: () => document.getElementById("root") as HTMLElement,
      bodyClassName: styles.dialogBody,
      content: dialogText,
      onConfirm: async () => {
        spaceCohostDecide({ sid: sid, flag: val }).then((res) => {
          console.log(res);
          datalist("refresh");
        });
      },
      onCancel: () => {
        console.log("onCancel");
      },
      cancelText: "Cancel",
      confirmText: "Confirm",
    });
  };

  return (
    <div className={styles.container}>
      <div className="maxWidth flex flex-col h-full relative">
        <div className={styles.header}>
          {showIcon ? (
            <div className={styles.searchIcon}>
              <SearchOutline
                onClick={() => {
                  setShowIcon(false);
                }}
              ></SearchOutline>
            </div>
          ) : (
            <SearchInput
              value={queryKey}
              className={styles.searchBar}
              onChange={(value: any) => {
                setQueryKey(value);
              }}
              onEnterPress={() => {
                datalist("refresh");
              }}
            ></SearchInput>
          )}

          <div
            className={styles.ethButton}
            onClick={(e) => {
              console.log("click ethButton");
              e.stopPropagation();
              router.push("/earning");
            }}
          >
            <Button
              backgroundColor="var(--sconedBorder)"
              textColor="var(--textColor)"
              showBorderShodow={false}
            >
              <Image
                className={styles.headerImg}
                src={userinfo.imageUrl ? userinfo.imageUrl : headerImg}
                width={40}
                height={40}
                alt=""
              />
              {walletBalance.toFixed(5)} ETH <RightOutline />
            </Button>
          </div>
        </div>
        <div className={styles.tabsList}>
          {tabsList.map((item, index) => {
            return (
              <div
                key={index + "q"}
                className={[
                  nowTab == item.key ? styles.active : "",
                  styles.tabs,
                ].join(" ")}
                onClick={() => {
                  nowTab = item.key;
                  datalist("refresh");
                  setNowTab(item.key);
                }}
              >
                {item.title}
              </div>
            );
          })}
        </div>
        <div className={styles.cardList}>
          <PullToRefresh
            onRefresh={() => datalist("refresh")}
            renderText={(status) => {
              return <div>{statusRecord[status]}</div>;
            }}
          >
            {/* 数据展示 */}
            <div className={`flex flex-wrap justify-between w-full`}>
              {data.map((item, index) => {
                const isSpaceReadyToOpen =
                  new Date(item.spaceBeginTime).getTime() - Date.now() <=
                  5 * 60 * 1000;
                const isUserSpace = !!isMySpace;

                return (
                  <div key={index + "s"} className={`w-full ${styles.wFull}`}>
                    <SuperSpaceCard
                      onClickDecide={onClickDecideSpace}
                      item={item}
                      onClick={() => {
                        console.log(item.sid);
                        router.push("/space/" + item.sid);
                      }}
                      className={styles.superSpace}
                      // isOnGoingSpace={true}
                      isOnGoingSpace={isUserSpace && isSpaceReadyToOpen}
                    ></SuperSpaceCard>
                  </div>
                );
              })}
            </div>
          </PullToRefresh>
          {/* 上拉刷新操作 */}
          <InfiniteScroll loadMore={() => datalist()} hasMore={hasMore}>
            -- no more --
          </InfiniteScroll>
        </div>

        {!isMySpace && (
          <div className={styles.createSpace}>
            <Button
              maxWidth={"340px"}
              onClick={goCreateSpace}
              width={"90vw"}
              height={"2.5rem"}
              className={styles.button}
            >
              Create a space
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
