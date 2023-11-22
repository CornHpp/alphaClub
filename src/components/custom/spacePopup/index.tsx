import React from "react";
import styles from "./index.module.scss";
import { Mask } from "antd-mobile";

interface SpacePopupProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  makeTwitter: () => void;
  children?: React.ReactNode;
}

const SpacePopup: React.FC<SpacePopupProps> = (props) => {
  const {
    show,
    onClose,
    title = "success",

    makeTwitter,
    children,
  } = props;
  return (
    <Mask
      visible={show}
      onMaskClick={onClose}
    >
      <div className={styles.overlayContent}>
        <div className={styles.topTitle}>{title}</div>
        <div className={styles.text}>{children}</div>
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
