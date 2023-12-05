import React from "react";
import styles from "../index.module.scss";
import Button from "@/components/ui/button";
import { useSpace } from "@/components/custom/FloatingSpace/SpaceProvider";

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
          {(item.role == "joined" ||
            item.role == "created" ||
            item.role == "cohost:yes" ||
            item.seatStatus == -1) && (
            <Button
              showBorderShodow={false}
              className={styles.button}
              onClick={onClickButton}
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
              onClick={onClickButton}
              background="rgba(255, 228, 120, 1)"
            >
              Bid!
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
  );
};

export default React.memo(MySpaceButtonList);
