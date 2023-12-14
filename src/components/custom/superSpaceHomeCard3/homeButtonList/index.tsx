import React from "react";
import styles from "../index.module.scss";
import Button from "@/components/ui/button";

interface HomeButtonListProps {
  // Define your props here
  item: allSpaceResponse;
  onClickButton: () => void;
}

const HomeButtonList: React.FC<HomeButtonListProps> = ({
  item,
  onClickButton,
}) => {
  return (
    <div className={styles.container}>
      {(item?.role == "joined" ||
        item?.role == "created" ||
        item?.role == "cohost:yes" ||
        item?.role == "waiting") && (
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
          className={styles.bidButton}
          onClick={onClickButton}
          background="rgba(255, 228, 120, 1)"
          width="59"
          height="19"
        >
          Bid!
        </Button>
      )}
    </div>
  );
};

export default HomeButtonList;
