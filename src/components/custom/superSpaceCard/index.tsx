"use client";
import React from "react";
import styles from "./index.module.scss";
import headerImg from "@/assets/images/home/headerImg.png";
import dollorSimple from "@/assets/images/home/dollorSimple.png";
import timepiece from "@/assets/images/home/timepiece.png";
import sofa from "@/assets/images/home/sofa.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { formatDateCheers } from "@/lib/utils";
import { useSpace } from "../FloatingSpace/SpaceProvider";

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

  return (
    <div className={[styles.superSpaceCard, className].join(" ")}>
      <header className={styles.topCard}>
        <div className={styles.SupersapceText}>{item.title}</div>
        <div className={styles.ethColor}>{item.priceStr} ETH</div>
      </header>
      <div className={styles.content}>
        <div className={styles.leftHeaderImg}>
          <Image
            width={40}
            height={40}
            style={{ borderRadius: "50%" }}
            src={item.imageUrl ? item.imageUrl : "headerImg"}
            alt=""
          />
        </div>
        <div className={styles.rightDetails}>
          <div className={`font-semibold ${styles.titterName}`}>
            {item?.twitterName}
          </div>
          <div className={styles.twitterName}>@{item?.twitterScreenName}</div>
          <div className={styles.text}>
            <Image
              width={21}
              height={21}
              src={sofa}
              alt=""
            ></Image>
            Space Seat Limit: {item?.maxSeatNumber}
          </div>
          <div className={styles.text}>
            <Image
              width={21}
              height={21}
              src={dollorSimple}
              alt=""
            ></Image>
            Bidding End Time：{formatDateCheers(item?.biddingEndTtime)}
          </div>
          <div className={styles.text}>
            <Image
              width={21}
              height={21}
              src={timepiece}
              alt=""
            ></Image>
            Space Beginning Time:{formatDateCheers(item?.spaceBeginTime)}
          </div>
        </div>

        {isOnGoingSpace ? (
          <Button
            width="84px"
            className={styles.buttonPosition}
            isLoading={isLoadingSpace}
            disabled={isLoadingSpace || !!currentSpace}
            onClick={handleJoinSpace}
            background="linear-gradient(90deg, rgba(116, 252, 150, 1) 0%, rgba(252, 205, 116, 0.32) 44.19%, rgba(246, 252, 116, 0) 83.2%)"
            showBorderShodow={false}
            border="1px solid rgba(151, 151, 151, 1)"
          >
            Join
          </Button>
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
                background="rgba(255, 242, 223, 1)"
                border="1px solid rgba(151, 151, 151, 1)"
              >
                Space Detail
              </Button>
            )}
            {item.role == "default" && (
              <Button
                showBorderShodow={false}
                className={styles.buttonPosition}
                onClick={onClick}
                background="rgba(255, 228, 120, 1)"
              >
                Bid a Place
              </Button>
            )}
            {item.role == "cohost:selecting" && (
              <Button
                background="rgba(0, 0, 0, 1)"
                className={styles.buttonPosition}
                textColor="rgba(254, 213, 55, 1)"
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
                background="rgba(243, 243, 243, 1)"
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

export default React.memo(SuperSpaceCard);
