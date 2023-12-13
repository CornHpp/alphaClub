"use client";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import headerImg from "@/assets/images/home/headerImg.png";
import dollorSimple from "@/assets/images/home/dollorSimple.png";
import timepiece from "@/assets/images/home/timepiece.png";
import hammerIcon from "@/assets/images/home/hammer.png";
import sofa from "@/assets/images/home/sofa.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { formatDate, formatDateCheers, localToUtc } from "@/lib/utils";
import { useSpace } from "../FloatingSpace/SpaceProvider";
import moneyIcon from "@/assets/images/home/moneyIcon.png";
import { getTimeRemaining } from "@/lib/utils";
import tickerIcon from "@/assets/images/home/tickerIcon.png";
import moreCoHost from "@/assets/images/home/moreCoHost.png";
import HomeButtonList from "./homeButtonList";
import MySpaceButtonList from "./mySpaceButtonList";
import Vector2 from "@/assets/images/home/Vector2.png";
import person from "@/assets/images/home/person.png";

interface SuperSpaceCardProps {
  title?: string;
  isMySpace?: boolean;
  description?: string;
  className?: string;
  onClick: () => void;
  item: allSpaceResponse;
  isOnGoingSpace?: boolean;
  onClickDecide: (sid: number, val: number) => void;
  clickTicker: (ticker: string) => void;
}

const SuperSpaceHomeCard2: React.FC<SuperSpaceCardProps> = ({
  className,
  onClick,
  item,
  isMySpace,
  isOnGoingSpace,
  onClickDecide,
  clickTicker,
}) => {
  const router = useRouter();
  const { setCurrentSpace, isLoadingSpace, currentSpace } = useSpace();
  const handleJoinSpace = () => {
    if (currentSpace) {
      return;
    }
    setCurrentSpace({ sid: item.sid, title: item.title });
  };

  const [biddingEndTime, setBiddingEndTime] = useState(
    getTimeRemaining(item?.biddingEndTtime),
  );

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setBiddingEndTime(getTimeRemaining(item?.biddingEndTtime));
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, [item]);

  return (
    <div className={[styles.superSpaceCard, className].join(" ")}>
      <div className={styles.titleBox}>{item?.title}</div>
      <div className="flex mt-[11px] items-center justify-between">
        <div className="flex mr-[8px]">
          <Image
            width={24}
            height={24}
            style={{ borderRadius: "50%" }}
            src={item.imageUrl ? item.imageUrl : "headerImg"}
            alt=""
            className=" border-1 border-[#E8E8E8FF] border-solid"
            onClick={() => {
              window.open(`https://twitter.com/${item?.twitterScreenName}`);
            }}
          />
          {item.cohost && item?.cohost.length > 0 && (
            <div className={styles.secondImage}>
              {item.cohost.slice(0, 2).map((cohost, index) => {
                return (
                  <Image
                    key={cohost.twitterScreenName}
                    width={24}
                    height={24}
                    style={{ borderRadius: "50%", marginLeft: "-3px" }}
                    src={cohost.imageUrl ? cohost.imageUrl : "headerImg"}
                    alt=""
                    className=" border-1 border-[#E8E8E8FF] border-solid relative"
                  />
                );
              })}
              {item.cohost && item.cohost.length > 2 && (
                <div className={styles.mocohost}>
                  <Image
                    width={24}
                    height={24}
                    style={{ borderRadius: "50%", marginLeft: "-3px" }}
                    src={moreCoHost}
                    alt=""
                    className=" border-1 border-[#E8E8E8FF] border-solid relative"
                  />
                  <div className={styles.moreNum}>
                    +{item.cohost.length - 1}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center">
          <Image
            src={person}
            alt=""
            width={12}
            height={12}
            className="w-[12px] h-[12px] align-bottom mr-[3px]"
          ></Image>
          <div className="mr-[6px] w-[20px] whitespace-nowrap overflow-hidden overflow-ellipsis">
            {item.twitterName}
          </div>
          <div
            className="w-[80px] whitespace-nowrap overflow-hidden 
          overflow-ellipsis text-[#999999FF]"
          >
            @{item.twitterScreenName}
          </div>
        </div>

        <div className="flex items-center">
          <Image
            className="flex-shrink-0 w-[10px] h-[9px]"
            src={sofa}
            alt="sofa"
            width={10}
            height={9}
          ></Image>
          <div className="ml-[4px] text-[#999999FF]">{item.maxSeatNumber}</div>
        </div>
        <div
          className="text-[#7948EAFF]
          w-[90px] whitespace-nowrap overflow-hidden overflow-ellipsis text-right"
        >
          {item?.ticker?.split(",").map((ticker, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  clickTicker(ticker);
                }}
                className="flex justify-end"
              >
                {item.ticker}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center mt-[15px] justify-between">
        <div className="flex items-center">
          <Image
            src={Vector2}
            alt="Vector2"
            width={12}
            height={18}
          ></Image>
          <div className="ml-[4px] text-[#08D2BCFF] font-bold">
            {item.priceStr}
          </div>
        </div>
        <div
          className="
        text-[#7948EAFF]
        w-[88px] h-[24px] flex bg-[#FAFAFAFF] justify-center rounded-[10px]"
        >
          <div className="font-bold">{biddingEndTime.hours}</div>
          <div className="mx-[2px]">h</div>
          <div className="font-bold mr-[2px]">{biddingEndTime.minutes}</div>
          <div>m</div>
          <div className="ml-[7px]">left</div>
        </div>

        {/* {!isMySpace ? (
          <HomeButtonList
            onClickButton={onClick}
            item={item}
          ></HomeButtonList>
        ) : ( */}
        <MySpaceButtonList
          item={item}
          onClickButton={onClick}
          isOnGoingSpace={isOnGoingSpace}
          onClickDecide={onClickDecide}
          isLoadingSpace={isLoadingSpace}
        ></MySpaceButtonList>
        {/* )} */}
      </div>
    </div>
  );
};

export default React.memo(SuperSpaceHomeCard2);
