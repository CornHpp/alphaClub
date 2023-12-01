import React from "react";
import styles from "./index.module.scss";
import { Mask } from "antd-mobile";
import doubtIcon from "@/assets/images/login/doubt.png";
import rightArrow from "@/assets/images/login/rightArrow.png";
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
              className={`flex w-full flex-col items-center ${styles.cardFront}`}
            >
              <Image
                className="mt-12"
                src={doubtIcon}
                alt="doubt"
                width={44}
                height={44}
              />
              <div className="w-5/6 text-4xl text-center font-bold text-white mt-8">
                Congrats!
              </div>
              <Image
                className="mt-12"
                src={rightArrow}
                alt="doubt"
                width={80}
                height={30}
                onClick={() => {
                  setRoundCardTimer(true);
                  setTimeout(() => {
                    setIsRound(true);
                  }, 100);
                }}
              />
            </div>
          ) : (
            <div
              className={`flex w-full flex-col items-center ${styles.cardBack}`}
            >
              <Image
                className="mt-12"
                src={doubtIcon}
                alt="doubt"
                width={44}
                height={44}
              />
              <div className="w-5/6 text-4xl text-center font-bold text-white mt-6">
                Bid or be bid on to claim points
              </div>

              <div
                className="text-4xl text-center font-bold text-white mt-8 w-2/4"
                style={{
                  color: "rgba(254, 215, 73, 1)",
                }}
              >
                + {points} Points
              </div>
            </div>
          )}
        </div>
      </div>
    </Mask>
  );
};

export default React.memo(RoundCard);
