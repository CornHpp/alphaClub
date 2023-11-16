"use client";
import dynamic from "next/dynamic";
import React from "react";
import styles from "./index.module.scss";
import headerImg from "@/assets/images/home/headerImg.png";
import dollorSimple from "@/assets/images/home/dollorSimple.png";
import timepiece from "@/assets/images/home/timepiece.png";
import sofa from "@/assets/images/home/sofa.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// import FloatingSpace from "../FloatingSpace";
const FloatingSpace = dynamic(() => import("../FloatingSpace"), { ssr: false });
import { useRouter } from "next/navigation";
import { formatDateCheers } from "@/lib/utils";

interface SuperSpaceCardProps {
  title?: string;
  description?: string;
  className?: string;
  onClick?: () => void;
  item: allSpaceResponse;
  isOnGoingSpace?: boolean;
  onClickDecide: (sid: number, val: number) => void;
}

const SuperSpaceCard: React.FC<SuperSpaceCardProps> = ({
  title,
  description,
  className,
  onClick,
  item,
  isOnGoingSpace,
  onClickDecide,
}) => {
  const router = useRouter()
  const [isOpeningSpace, setIsOpeningSpace] = React.useState(false)
  return (
    <div className={[styles.superSpaceCard, className].join(" ")}>
      <header className={styles.topCard}>
        <div className={styles.SupersapceText}>{item.title}</div>
        <div className={styles.ethColor}>{item.price} ETH</div>
      </header>
      <div className={styles.content}>
        <div className={styles.leftHeaderImg}>
          <Image
            width={40}
            height={40}
            style={{ borderRadius: "50%" }}
            src={item.imageUrl ? item.imageUrl : headerImg}
            alt=""
          />
        </div>
        <div className={styles.rightDetails}>
          <div className="font-semibold">{item?.twitterName}</div>
          <div className={styles.twitterName}>@{item?.twitterScreenName}</div>
          <div className={styles.text}>
            <Image width={21} height={21} src={sofa} alt=""></Image>
            Space Seat Limit: {item?.maxSeatNumber}
          </div>
          <div className={styles.text}>
            <Image width={21} height={21} src={timepiece} alt=""></Image>
            {formatDateCheers(item?.spaceBeginTime)}
          </div>
          <div className={styles.text}>
            <Image width={21} height={21} src={dollorSimple} alt=""></Image>
            Bidding End Time：{formatDateCheers(item?.biddingEndTtime)}
          </div>
        </div>

        {isOnGoingSpace ? (
          <FloatingSpace
            triggerNode={
              <Button
                className={styles.buttonPosition}
                isLoading={isOpeningSpace}
                onClick={() => setIsOpeningSpace(true)}
                disabled={isOpeningSpace}
              >
                Join
              </Button>
            }
            space={{ sid: item.sid, title: title ?? item.title }}
            onSpaceOpened={() => setIsOpeningSpace(false)}
            // isOpeningSpace={isOpeningSpace}
            // onOpeningSpace={(x) => setIsOpeningSpace(x)}
          />
        ) : (
          <div>
            {/* <Button className={styles.buttonPosition} onClick={onClick}>
              {buttonTitle}
            </Button> */}

            {(item.role == "joined" ||
              item.role == "created" ||
              item.role == "cohost:yes") && (
              <Button
                showBorderShodow={false}
                className={styles.buttonPosition}
                onClick={() => {
                  router.push(`/space/${item.sid}`);
                }}
                backgroundColor="rgba(255, 228, 120, 1)"
              >
                Space Detail
              </Button>
            )}
            {item.role == "default" && (
              <Button
                showBorderShodow={false}
                className={styles.buttonPosition}
                onClick={onClick}
                backgroundColor="rgba(255, 228, 120, 1)"
              >
                Bid a Place
              </Button>
            )}
            {item.role == "cohost:selecting" && (
              <Button
                backgroundColor="rgba(255, 228, 120, 1)"
                className={styles.buttonPosition}
                onClick={() => {
                  onClickDecide(item.sid, 1);
                }}
                showBorderShodow={false}
              >
                Accept
              </Button>
            )}
            {item.role == "cohost:selecting" && (
              <Button
                backgroundColor="rgba(243, 243, 243, 1)"
                className={styles.buttonDeclinePosition}
                onClick={() => {
                  onClickDecide(item.sid, 0);
                }}
                showBorderShodow={false}
              >
                Decline
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperSpaceCard;