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
import {
  formatDate,
  formatDateCheers,
  getPercent,
  localToUtc,
  utcToLocal,
} from "@/lib/utils";
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
import hammer1 from "@/assets/images/home/hammer1.png";
import ProgressView from "./progressView";

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
        <div
          className="flex-1 
         overflow-hidden overflow-ellipsis whitespace-nowrap
         font-medium
        "
        >
          {item?.title}
        </div>
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
        {isMySpace ? (
          <div className="">
            <div className="flex items-center">
              <Image
                src={hammer1}
                className="w-[12px] h-[12px] mr-[3px]"
                alt=""
                width={12}
                height={12}
              ></Image>
              Bid price:
            </div>
            <div className="font-bold">{item.priceStr} ETH</div>
          </div>
        ) : (
          <ProgressView item={item}></ProgressView>
        )}

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
