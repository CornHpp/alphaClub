import React from "react";
import styles from "./index.module.scss";
import notificationImg from "@/assets/images/notification.png";
import { CloseCircleOutline } from "antd-mobile-icons";
import Image from "next/image";

interface IProps {
  show: boolean;
  hideShow: () => void;
  children: React.ReactNode;
}

export const Notification: React.FC<IProps> = (props) => {
  const { show, hideShow, children } = props;
  const clickComfirm = () => {
    console.log("clickComfirm");
    hideShow();
  };

  return show ? (
    <div className={styles.comingSoonBox}>
      <div className={styles.imgBox}>
        <Image
          src={notificationImg}
          width={442}
          height={581}
          className={styles.firstPopup}
          alt=""
        />
        <div className={styles.commingSoonText}>{children}</div>
        <div className={styles.comfirm} onClick={clickComfirm}>
          Comfirm
        </div>
        <div
          className={styles.hideNotifacation}
          onClick={() => {
            hideShow();
          }}
        ></div>
      </div>
    </div>
  ) : null;
};

export default Notification;
