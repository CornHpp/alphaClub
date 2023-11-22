import React from "react";
import styles from "./index.module.scss";
import { Mask } from "antd-mobile";

interface SpacePopupProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  price: string | number;
  spaceTitle: string;
  whom: string;
  makeTwitter: () => void;
}

const SpacePopup: React.FC<SpacePopupProps> = (props) => {
  const {
    show,
    onClose,
    title = "success",
    price,
    spaceTitle,
    whom,
    makeTwitter,
  } = props;
  return (
    <Mask
      visible={show}
      onMaskClick={onClose}
    >
      <div className={styles.overlayContent}>
        <div className={styles.topTitle}>{title}</div>
        <div className={styles.text}>
          You have stolen {whom} Seat at What is next for {spaceTitle} Keep it
          till the end or earn <span>{price}</span> ETH when your seat gets
          taken...
        </div>
        <div
          className={styles.button}
          onClick={makeTwitter}
        >
          Make a twitter
        </div>
      </div>
    </Mask>
  );
};

export default React.memo(SpacePopup);
