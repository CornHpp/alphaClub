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

  const [isRound, setIsRound] = React.useState(false);
  return (
    <Mask
      visible={show}
      onMaskClick={onClose}
    >
      <div className={styles.overlayContent}>
        {!isRound ? (
          <div className="flex w-full flex-col items-center">
            <Image
              className="mt-12"
              src={doubtIcon}
              alt="doubt"
              width={44}
              height={44}
            />
            <div className="w-5/6 text-4xl text-center font-bold text-white mt-8">
              How many social points are you worth?
            </div>
            <Image
              className="mt-12"
              src={rightArrow}
              alt="doubt"
              width={80}
              height={30}
              onClick={() => {
                setIsRound(true);
              }}
            />
          </div>
        ) : (
          <div className="flex w-full flex-col items-center">
            <Image
              className="mt-12"
              src={doubtIcon}
              alt="doubt"
              width={44}
              height={44}
            />
            <div className="w-5/6 text-4xl text-center font-bold text-white mt-16">
              Congrats!
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
    </Mask>
  );
};

export default React.memo(RoundCard);
