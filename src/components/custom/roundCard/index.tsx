import React from "react";
import styles from "./index.module.scss";
import { Mask } from "antd-mobile";
import doubtIcon from "@/assets/images/login/doubt.png";
import rightArrow from "@/assets/images/login/rightArrow.png";
import frontCard from "@/assets/images/login/frontCard.png";
import backCard from "@/assets/images/login/backCard.png";
import Image from "next/image";

interface RoundCardProps {
  show: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  points?: number;
}

const RoundCard: React.FC<RoundCardProps> = (props) => {
  const { show, onClose, points } = props;

  const clickShadow = () => {
    if (!isRound) return;
    onClose();
  };

  const [isRound, setIsRound] = React.useState(false);
  const [roundCardTimer, setRoundCardTimer] = React.useState<any>(null);
  return (
    <Mask
      visible={show}
      onMaskClick={clickShadow}
    >
      <div className={styles.overlayContent}>
        <div
          className={`${styles.card} ${
            roundCardTimer ? styles.clickRound : ""
          }`}
        >
          {!isRound ? (
            <div
              className={`flex  flex-col items-center w-[255px] h-[412px]`}
              onClick={() => {
                setRoundCardTimer(true);
                setTimeout(() => {
                  setIsRound(true);
                }, 100);
              }}
            >
              <Image
                className="w-full"
                src={frontCard}
                alt="doubt"
                width={255}
                height={412}
              />
            </div>
          ) : (
            <div
              className={`flex w-[255px] h-[412px] relative flex-col items-center ${styles.cardBack}`}
            >
              <Image
                className="w-full"
                src={backCard}
                alt="doubt"
                width={255}
                height={412}
              />
              <div
                className="absolute bottom-[76px] 
                left-[73px] font-bold text-[#FF5C35]
              text-[32px]
              w-[59px]
              text-center
              "
              >
                {points}
              </div>
            </div>
          )}
        </div>
      </div>
    </Mask>
  );
};

export default React.memo(RoundCard);
