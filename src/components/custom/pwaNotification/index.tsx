import React from "react";
import styles from "./index.module.scss";

interface IProps {
  show: boolean;
  hideShow: () => void;
  children?: React.ReactNode;
}

export const BackGround: React.FC<IProps> = (props) => {
  const { show, hideShow, children } = props;
  const clickComfirm = () => {
    hideShow();
  };

  return show ? (
    <div className={styles.comingSoonBox}>
      <div className={styles.background} onClick={clickComfirm}></div>
      <div className={styles.content}>{children}</div>
    </div>
  ) : null;
};

export default BackGround;
