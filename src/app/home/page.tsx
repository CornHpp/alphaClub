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
import {
  InfiniteScroll,
  Dialog,
  PullToRefresh,
  FloatingBubble,
} from "antd-mobile";
import { PullStatus } from "antd-mobile/es/components/pull-to-refresh";
import { getAllSpace, getMySpace, spaceCohostDecide } from "@/service/space";
import { getBalance } from "@/service/userService";
import { useSelector } from "react-redux";
import SuperSpaceHomeCard from "@/components/custom/superSpaceHomeCard";
import Loading from "@/components/custom/Loading";
import vector from "@/assets/images/home/Vector.png";
import SuperSpaceHomeCard3 from "@/components/custom/superSpaceHomeCard3";
import { isTimeAfter, localToUtc } from "@/lib/utils";
import createSpaceIcon from "@/assets/images/home/createSpaceIcon.png";

const statusRecord: Record<PullStatus, string> = {
  pulling: "pull-down",
  canRelease: "Release the hand",
  refreshing: "loading...",
  complete: "ok",
};

const HometabsList = [
  {
    title: "Top",
    key: "top",
  },
  {
    title: "New",
    key: "new",
  },
  {
    title: "Ending",
    key: "endTime",
  },
];

const mySpaceTabsList = [
  {
    title: "Starting",
    key: "joined",
  },
  {
    title: "Created&Co-Host",
    key: "created",
  },
];
type homeProps = {
  isMySpace: boolean;
};

type _selfParamsProps = {
  pageNum: number;
  pageSize: number;
  orderBy?: string;
  queryKey?: string;
  type?: string;
  ticker?: string;
  joinedType?: string;
};

const Home: React.FC<homeProps> = (props) => {
  const { isMySpace } = props;

  const tabsList = isMySpace ? mySpaceTabsList : HometabsList;

  const getListFunction = isMySpace ? getMySpace : getAllSpace;

  let [nowTab, setNowTab] = useState(isMySpace ? "joined" : "top");
  const [showIcon, setShowIcon] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [showLoading, setShowLoading] = useState(false);
  const router = useRouter();
  const { userinfo } = useSelector((state: any) => state.user);
  const [offset, setOffset] = useState({ x: -24, y: -24 });

  let [pageMap, setPageMap] = useState({
    pageNum: 1,
    type: "new",
    ticker: "",
  });
  const [queryKey, setQueryKey] = useState("");

  const clickTickerSearch = (ticker: string) => {
    if (isMySpace) return;
    pageMap.ticker = ticker;
    datalist("refresh");
  };

  //获取首次渲染的数据
  const datalist = async (type?: string) => {
    const isInit = type === "refresh";
    if (isInit) {
      pageMap.pageNum = 1;
      pageMap.type = "new";
    }

    const param: _selfParamsProps = {
      pageNum: pageMap.pageNum,
      pageSize: 10,
      queryKey,
    };
    if (isMySpace) {
      param.type = pageMap.type;
      param.joinedType = nowTab;
    } else {
      param.orderBy = nowTab;
      param.ticker = pageMap.ticker;
    }

    return getListFunction(param).then((res) => {
      let { pageList = [], count = 0 } = res.result;
      if (!pageList) pageList = [];
      pageList = filterPageList(pageList);

      const newList = [...(isInit ? [] : data), ...(pageList ? pageList : [])];

      pageMap.ticker = "";
      setData(newList);
      setHasMore(newList.length >= count ? false : pageList?.length > 0);
      if (newList.length < 10) {
        pageMap.pageNum = 1;
        pageMap.type = "old";
      } else {
        pageMap.pageNum++;
      }
    });
  };

  const filterPageList = (pageList: any) => {
    if (!isMySpace) {
      if (pageList.length > 0) {
        pageList = pageList.map((item: any) => {
          if (
            item.role == "joined" ||
            item.role == "created" ||
            item.role == "cohost:yes" ||
            item.role == "default"
          ) {
            if (nowTab == "created") {
              item.role = "created";
            } else if (nowTab == "joined") {
              item.role = "joined";
            }
          }
          return item;
        });
      }
    }
    return pageList;
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
    setShowLoading(true);
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
    // Add id for floating space injection
    <div
      className={styles.container}
      id="__space_root"
    >
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
              e.stopPropagation();
              setShowLoading(true);
              router.push("/earning");
            }}
          >
            <Button
              background="var(--sconedBorder)"
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
              <span style={{ lineHeight: 0 }}>
                {walletBalance.toFixed(5)} ETH
              </span>
              <RightOutline />
            </Button>
          </div>
        </div>
        {
          <div className={styles.tabsList}>
            {tabsList?.map((item, index) => {
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
        }

        <div className={styles.cardList}>
          <PullToRefresh
            onRefresh={() => datalist("refresh")}
            renderText={(status) => {
              return <div>{statusRecord[status]}</div>;
            }}
          >
            {/* 数据展示 */}
            <div className={`flex flex-wrap justify-between w-full`}>
              {!isMySpace && (
                <div className={styles.natification}>
                  <div className={styles.text}>
                    Bid for a voice 🎙️ space below ,earn
                    &nbsp;&nbsp;&nbsp;&nbsp; when you are kicked out, listen &
                    earn alpha when you stay.
                    <Image
                      src={vector}
                      alt=""
                      width={11}
                      className={styles.vector}
                      height={18}
                    ></Image>
                  </div>
                </div>
              )}
              {data.length > 0 &&
                data.map((item, index) => {
                  const isOnGoingSpace = isTimeAfter(
                    localToUtc(item.spaceBeginTime),
                  );
                  return (
                    <div
                      key={index + "s"}
                      className={`w-full ${styles.wFull}`}
                    >
                      <SuperSpaceHomeCard3
                        clickTicker={clickTickerSearch}
                        onClickDecide={onClickDecideSpace}
                        item={item}
                        isMySpace={isMySpace ? true : false}
                        onClick={() => {
                          setShowLoading(true);
                          router.push("/space/" + item.sid);
                        }}
                        className={styles.superSpace}
                        isOnGoingSpace={isOnGoingSpace}
                      ></SuperSpaceHomeCard3>
                    </div>
                  );
                })}
            </div>
          </PullToRefresh>
          {/* 上拉刷新操作 */}
          <InfiniteScroll
            loadMore={() => datalist()}
            hasMore={hasMore}
          >
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

      {/* next.js有编译的速度问题，加一个loading，来开启loading */}
      {showLoading && <Loading></Loading>}
      {isMySpace && (
        <FloatingBubble
          onClick={() => {
            router.push("createSpace");
          }}
          axis="xy"
          magnetic="x"
          style={{
            "--initial-position-bottom": "80px",
            "--initial-position-right": "0",
            "--background": "var(--primary-background-color)",
            "--edge-distance": "80px 16px",
          }}
          onOffsetChange={(offset) => {
            setOffset(offset);
          }}
          offset={offset}
        >
          <Image
            src={createSpaceIcon}
            alt=""
            className="w-[50px] h-[50px] max-w-[50px]"
            width={50}
            height={50}
          ></Image>
        </FloatingBubble>
      )}
    </div>
  );
};

export default Home;
