import React from "react";
import styles from "./index.module.scss";
import { Mask } from "antd-mobile";

interface SpacePopupProps {
  show: boolean;
  onClose: () => void;
}

const SpacePopup: React.FC<SpacePopupProps> = (props) => {
  const { show, onClose } = props;
  return (
    <Mask
      visible={show}
      onMaskClick={onClose}
    >
      <div className={styles.overlayContent}>
        <div className={styles.topTitle}>Create Space</div>
        <div className={styles.text}>
          You have stolen Lucas Seat at What is next for RGBKeep it till the end
          or earn <span>6.973</span> ETH when your seat gets taken...
        </div>
        <div className={styles.button}>Make a twitter</div>
      </div>
    </Mask>
  );
};

export default React.memo(SpacePopup);
