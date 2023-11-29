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
import { formatDateCheers } from "@/lib/utils";
import { useSpace } from "../FloatingSpace/SpaceProvider";
import moneyIcon from "@/assets/images/home/moneyIcon.png";
import { getTimeRemaining } from "@/lib/utils";

interface SuperSpaceCardProps {
  title?: string;
  description?: string;
  className?: string;
  onClick?: () => void;
  item: allSpaceResponse;
  isOnGoingSpace?: boolean;
  onClickDecide: (sid: number, val: number) => void;
}

const SuperSpaceHomeCard: React.FC<SuperSpaceCardProps> = ({
  className,
  onClick,
  item,
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
          <span>{item?.title}</span>
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

          {(item?.role == "joined" ||
            item?.role == "created" ||
            item?.role == "cohost:yes") && (
            <Button
              showBorderShodow={false}
              className={styles.button}
              onClick={() => {
                router.push(`/space/${item?.sid}`);
              }}
              background="rgba(255, 228, 120, 1)"
            >
              Space Detail
            </Button>
          )}
          {item.role == "default" && (
            <Button
              showBorderShodow={false}
              className={styles.button}
              onClick={onClick}
              background="rgba(255, 228, 120, 1)"
              width="59"
              height="19"
            >
              Bid a Place
            </Button>
          )}
        </div>
      </header>
      <div className={styles.content}>
        <div className={styles.leftHeader}>
          <div className={styles.headerImgBox}>
            <Image
              width={40}
              height={40}
              style={{ borderRadius: "50%" }}
              src={item.imageUrl ? item.imageUrl : "headerImg"}
              alt=""
              className={styles.headerImg}
            />
            <div className={styles.secondImage}>
              <Image
                width={40}
                height={40}
                style={{ borderRadius: "50%" }}
                src={item.imageUrl ? item.imageUrl : "headerImg"}
                alt=""
              />
              <Image
                width={40}
                height={40}
                style={{ borderRadius: "50%" }}
                src={item.imageUrl ? item.imageUrl : "headerImg"}
                alt=""
                className={styles.headerImg}
              />
            </div>
          </div>

          <div className={styles.centerDetails}>
            <div className={styles.twitterName}>
              {item?.twitterName} <span>@{item?.twitterScreenName}</span>
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
            <div>Avaliable Seats</div>
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
                <span className="text-lg font-bold">
                  {biddingEndTime.seconds}
                </span>{" "}
                S
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
              <div>
                <span className="text-lg font-bold">
                  {getTimeRemaining(item?.spaceBeginTime).hours}
                </span>{" "}
                H{" "}
                <span className="text-lg font-bold">
                  {getTimeRemaining(item?.spaceBeginTime).minutes}
                </span>{" "}
                M{" "}
                <span className="text-lg font-bold">
                  {getTimeRemaining(item?.spaceBeginTime).seconds}
                </span>{" "}
                S
              </div>
              <div>Till Room Begins</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SuperSpaceHomeCard);
