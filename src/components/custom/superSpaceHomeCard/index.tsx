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
import { formatDate, formatDateCheers } from "@/lib/utils";
import { useSpace } from "../FloatingSpace/SpaceProvider";
import moneyIcon from "@/assets/images/home/moneyIcon.png";
import { getTimeRemaining } from "@/lib/utils";
import tickerIcon from "@/assets/images/home/tickerIcon.png";
import moreCoHost from "@/assets/images/home/moreCoHost.png";
import HomeButtonList from "./homeButtonList";
import MySpaceButtonList from "./mySpaceButtonList";

interface SuperSpaceCardProps {
  title?: string;
  isMySpace?: boolean;
  description?: string;
  className?: string;
  onClick: () => void;
  item: allSpaceResponse;
  isOnGoingSpace?: boolean;
  onClickDecide: (sid: number, val: number) => void;
}

const SuperSpaceHomeCard: React.FC<SuperSpaceCardProps> = ({
  className,
  onClick,
  item,
  isMySpace,
  isOnGoingSpace,
  onClickDecide,
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
      <header className={styles.topCard}>
        <div className={styles.SupersapceTextTitile}>
          <div className={styles.ticker}>
            <Image
              src={tickerIcon}
              width={20}
              height={20}
              alt=""
            ></Image>
            Ticker($): {item?.ticker}
          </div>
          <p>item?.title</p>
        </div>
        <div className={styles.ethColor}>
          <div className={styles.moneyBox}>
            <Image
              src={moneyIcon}
              alt=""
              width={18}
              height={18}
            ></Image>
            <span>{item?.priceStr}</span>
          </div>

          {!isMySpace ? (
            <HomeButtonList
              onClickButton={onClick}
              item={item}
            ></HomeButtonList>
          ) : (
            <MySpaceButtonList
              item={item}
              onClickButton={onClick}
              isOnGoingSpace={isOnGoingSpace}
              onClickDecide={onClickDecide}
              isLoadingSpace={isLoadingSpace}
            ></MySpaceButtonList>
          )}
        </div>
      </header>
      <div className={styles.content}>
        <div className={styles.leftHeader}>
          <div
            className={styles.headerImgBox}
            onClick={() => {
              window.open(`https://twitter.com/${item?.twitterScreenName}`);
            }}
          >
            <Image
              width={40}
              height={40}
              style={{ borderRadius: "50%" }}
              src={item.imageUrl ? item.imageUrl : "headerImg"}
              alt=""
              className={styles.headerImg}
            />
            {item.cohost && item?.cohost.length > 0 && (
              <div className={styles.secondImage}>
                {item.cohost.slice(0, 2).map((cohost) => {
                  return (
                    <Image
                      key={cohost.twitterScreenName}
                      width={40}
                      height={40}
                      style={{ borderRadius: "50%" }}
                      src={cohost.imageUrl ? cohost.imageUrl : "headerImg"}
                      alt=""
                      className={styles.headerImg}
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
                      className={styles.headerImg}
                    />
                    <div className={styles.moreNum}>
                      +{item.cohost.length - 1}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.centerDetails}>
            {isMySpace && (
              <div className={styles.host}>
                My Role: <span>Host</span>
              </div>
            )}

            <div
              className={styles.twitterName}
              style={{
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {item?.twitterName}

              <div
                className={styles.twitterName}
                style={{
                  fontSize: "10px",
                  fontWeight: "200",
                  paddingLeft: 0,
                  marginLeft: 0,
                }}
              >
                @{item?.twitterScreenName}
              </div>
            </div>

            <div className={styles.sofa}>
              <Image
                src={sofa}
                alt=""
                width={21}
                height={21}
                className={styles.sofaImg}
              ></Image>
              <span className={styles.maxSeatNumber}>
                {item?.maxSeatNumber}
              </span>
            </div>
            <div style={{ fontSize: "12px", fontWeight: "600" }}>
              Total Seats
            </div>
          </div>
        </div>

        <div className={styles.timeRemain}>
          <div className={styles.biddingEnd}>
            <Image
              src={hammerIcon}
              alt=""
              width={15}
              height={15}
              className={`${styles.hammerIcon} mt-1.5`}
            ></Image>
            <div className={styles.TimeText}>
              <div>
                <span className="text-lg font-bold">
                  {biddingEndTime.hours}
                </span>{" "}
                H{" "}
                <span className="text-lg font-bold">
                  {biddingEndTime.minutes}
                </span>{" "}
                M{" "}
              </div>
              <div>Till Bidding Ends</div>
            </div>
          </div>
          <div className={`${styles.BeginEnd} mt-1.5`}>
            <Image
              src={timepiece}
              alt=""
              width={21}
              height={21}
              className={`${styles.timepiece} mt-1.5`}
            ></Image>
            <div className={styles.TimeText}>
              <div>Room Begins</div>
              <div>
                <span className="">
                  {formatDate(item?.spaceBeginTime, "yyyy/MM/dd hh:mm")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SuperSpaceHomeCard);
