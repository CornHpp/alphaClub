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
import microphone from "@/assets/images/home/microphone.png";
import progress from "@/assets/images/home/progress.png";
import bell from "@/assets/images/home/bell.png";

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
      <div className={styles.titleBox}>
        <Image
          src={microphone}
          width={16}
          height={16}
          className="mr-[4px]"
          alt=""
        ></Image>
        {item?.title}
      </div>
      <div className="flex mt-[8px] items-center justify-between">
        <div
          className="flex items-center"
          onClick={() => {
            window.open(`https://twitter.com/${item?.twitterScreenName}`);
          }}
        >
          <Image
            width={36}
            height={36}
            style={{ borderRadius: "50%" }}
            src={item.imageUrl ? item.imageUrl : "headerImg"}
            alt=""
            className="flex-shrink-0 w-[36px] h-[36px]"
          />

          <div className="ml-[8px]">
            <div className="flex items-center">
              <Image
                src={person}
                alt=""
                width={12}
                height={16}
                className="w-[12px] h-[16px] align-bottom mr-[3px]"
              ></Image>
              <div className="text-[14px] font-semibold">
                {item.twitterName}
              </div>
            </div>
            <div className="text-[#999999]">@{item.twitterScreenName}</div>
          </div>
        </div>

        <div className="flex">
          {item?.ticker
            ?.split(",")
            .slice(0, 2)
            .map((ticker, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    clickTicker(ticker);
                  }}
                  style={{
                    background:
                      index == 0
                        ? "rgba(121, 72, 234, 0.05)"
                        : "rgba(54, 201, 184, 0.05)",
                    color: index == 0 ? "#7948EA" : "#36C9B8",
                    marginLeft: index == 0 ? "0px" : "8px",
                  }}
                  className="max-w-[68px] 
                  whitespace-nowrap overflow-ellipsis
                  overflow-hidden 
                   py-[4px] px-[8px]  rounded-[4px]"
                >
                  {ticker}
                </div>
              );
            })}
        </div>
      </div>
      <div className="mt-[12px] flex items-center justify-between">
        <div className="h-[42px]">
          <div className="text-[#333333] text-[12px]">
            <span className="text-[#FF9500] text-[20px] font-bold">
              {biddingEndTime.hours}{" "}
            </span>
            hours{" "}
            <span className="text-[#FF9500] text-[20px] font-bold">
              {" "}
              {biddingEndTime.minutes}{" "}
            </span>
            mins left
          </div>
          <div className="w-[128px] h-[9px] relative   mt-[5px]">
            <Image
              src={progress}
              alt="progress"
              width={128}
              height={9}
            ></Image>
            <div
              className="absolute right-0 top-0 
              h-full rounded-[4px] bg-[#EDEDED]"
              style={{
                width: "30%",
              }}
            ></div>
            <Image
              className="absolute top-[-4.5px] w-[18px] h-[18px]
              "
              style={{
                right: "30%",
              }}
              src={bell}
              alt="bell"
              width={18}
              height={18}
            ></Image>
          </div>
        </div>
        <MySpaceButtonList
          item={item}
          onClickButton={onClick}
          isOnGoingSpace={isOnGoingSpace}
          onClickDecide={onClickDecide}
          isLoadingSpace={isLoadingSpace}
        ></MySpaceButtonList>
      </div>
      <div className="flex items-center mt-[17px] justify-between">
        {item.cohost && item?.cohost.length > 0 && (
          <div className={styles.secondImage}>
            {item.cohost.slice(0, 3).map((cohost, index) => {
              return (
                <Image
                  key={cohost.twitterScreenName}
                  width={24}
                  height={24}
                  style={{
                    borderRadius: "50%",
                    marginLeft: index === 0 ? "0px" : "-6px",
                  }}
                  src={cohost.imageUrl ? cohost.imageUrl : "headerImg"}
                  alt=""
                  className="w-[24px] h-[24px] border-1 border-[#fff] border-solid relative"
                />
              );
            })}
            {item.cohost && item.cohost.length > 3 && (
              <div className={styles.mocohost}>
                <Image
                  width={24}
                  height={24}
                  style={{ borderRadius: "50%", marginLeft: "-6px" }}
                  src={moreCoHost}
                  alt=""
                  className="w-[24px] h-[24px] border-1 border-[#fff] border-solid relative"
                />
                <div className={styles.moreNum}>+{item.cohost.length - 1}</div>
              </div>
            )}
          </div>
        )}
        {/* <div className="flex items-center">
          <Image
            src={Vector2}
            alt="Vector2"
            width={12}
            height={18}
          ></Image>
          <div className="ml-[4px] text-[#08D2BCFF] font-bold">
            {item.priceStr}
          </div>
        </div> */}
        <div className="text-[#333333] text-[12px] font-[500]">
          <span className="text-[#999999]">Begins at </span>
          {localToUtc(item.spaceBeginTime)}
        </div>

        <div className="flex items-center">
          <Image
            className="flex-shrink-0 w-[16px] h-[16px]"
            src={sofa}
            alt="sofa"
            width={16}
            height={16}
          ></Image>
          <div className="ml-[4px] text-[#999999FF]">
            Total Seats:{" "}
            <span className="text-[#333333] font-[500]">
              {item.maxSeatNumber}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SuperSpaceHomeCard2);
