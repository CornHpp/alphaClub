import React from "react";

import styles from "./index.module.scss";

interface IProps {
  title: React.ReactNode | string;
  rightChildren?: React.ReactNode | string;
  children?: React.ReactNode | string;
  className?: string;
}

const AlphaCard: React.FC<IProps> = (props) => {
  const { title, rightChildren, children, className } = props;
  return (
    <div className={`${styles.baseCard} ${className}`}>
      <div className={styles.top}>
        <div className={styles.title}>{title}</div>
        <div className={styles.rightFlex}>{rightChildren}</div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default AlphaCard;
