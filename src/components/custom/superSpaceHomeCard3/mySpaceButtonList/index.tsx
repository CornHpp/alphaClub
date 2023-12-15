import React from "react";
import styles from "../index.module.scss";
import Button from "@/components/ui/button";
import { useSpace } from "@/components/custom/FloatingSpace/SpaceProvider";
import SpaceButton from "../spaceButton";
import moneyIcon from "@/assets/images/home/moneyIcon.png";
import Image from "next/image";

interface HomeButtonListProps {
  // Define your props here
  item: allSpaceResponse;
  onClickButton: () => void;
  isOnGoingSpace?: boolean;
  onClickDecide: (sid: number, val: number) => void;
  isLoadingSpace: boolean;
}

const MySpaceButtonList: React.FC<HomeButtonListProps> = ({
  item,
  onClickButton,
  isOnGoingSpace,
  onClickDecide,
}) => {
  const { setCurrentSpace, isLoadingSpace, currentSpace } = useSpace();
  const handleJoinSpace = () => {
    if (currentSpace) {
      return;
    }
    setCurrentSpace({ sid: item.sid, title: item.title });
  };

  return (
    <div className={styles.container}>
      {isOnGoingSpace && item.seatStatus != -1 ? (
        <Button
          width="125px"
          className={styles.buttonPosition}
          isLoading={isLoadingSpace}
          disabled={isLoadingSpace || !!currentSpace}
          onClick={handleJoinSpace}
          background="linear-gradient(134.77deg, #E7FFA1 0%, #D7FF26 47%, #E7FFA1 99.67%)"
          showBorderShodow={false}
          border="none"
          height="42px"
          borderRadius="21px"
        >
          <div className="font-bold text-[16px]">Join</div>
        </Button>
      ) : (
        <div>
          {(item.role == "joined" ||
            item.role == "created" ||
            item.role == "cohost:yes" ||
            item.role == "waiting" ||
            item.seatStatus == -1) && (
            <Button
              showBorderShodow={false}
              className={styles.button}
              onClick={onClickButton}
              background="linear-gradient(134.77deg, #E7FFA1 0%, #D7FF26 47%, #E7FFA1 99.67%)"
              border="none"
              height="42px"
              width="157px"
              borderRadius="21px"
            >
              <div className="font-bold text-[16px]">Space Detail</div>
            </Button>
          )}
          {item.role == "default" && (
            <SpaceButton clickButton={onClickButton}>
              <div className="flex flex-col items-center leading-4">
                <div className="flex items-center">
                  <Image
                    src={moneyIcon}
                    alt=""
                    width={12}
                    height={14}
                    className="w-[12px] h-[14px] mr-1"
                  ></Image>
                  <span className="text-[16px] font-bold">{item.priceStr}</span>
                </div>
                <div>Place a bid</div>
              </div>
            </SpaceButton>
          )}
          <div className="flex ">
            {item.role == "cohost:selecting" && (
              <div className="mr-[6px]">
                <Button
                  background="rgba(243, 243, 243, 1)"
                  className={styles.buttonDeclinePosition}
                  backgroundColor="#EDEDED"
                  onClick={() => {
                    onClickDecide(item.sid, 0);
                  }}
                  height="42px"
                  width="106px"
                  borderRadius="21px"
                  showBorderShodow={false}
                >
                  <div className="font-bold text-[16px]">Decline</div>
                </Button>
              </div>
            )}
            {item.role == "cohost:selecting" && (
              <Button
                background="linear-gradient(134.77deg, #E7FFA1 0%, #D7FF26 47%, #E7FFA1 99.67%)"
                className={styles.buttonPosition}
                onClick={() => {
                  onClickDecide(item.sid, 1);
                }}
                height="42px"
                width="106px"
                borderRadius="21px"
                showBorderShodow={false}
              >
                <div className="font-bold text-[16px]">Accept</div>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(MySpaceButtonList);
