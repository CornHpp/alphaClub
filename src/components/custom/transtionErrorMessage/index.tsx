import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Popup, ProgressBar, Space } from "antd-mobile";
import transationErrrorImg from "@/assets/images/transationErrror-2.png";
import Image from "next/image";

interface TranstionErrorMessageProps {
  show?: boolean;
  hideErrorMessage?: () => void;
  transaction?: any;
  isLoading: boolean;
}

export const TranstionErrorMessage: React.FC<TranstionErrorMessageProps> = ({
  transaction,
  show,
  hideErrorMessage,
  isLoading,
}) => {
  const [progress, setprogress] = useState<number>(0);
  const [msg, setmsg] = useState<string>("initing orders...");

  const startProgress = () => {
    setprogress(0);
    setmsg("initing orders...");
    const interval = setInterval(() => {
      setprogress((prev) => {
        if (prev == 10) {
          setmsg("Posting Order...");
        } else if (prev == 30) {
          setmsg("Submitting order to chain...");
        } else if (prev == 50) {
          setmsg("Waiting for confirmation...");
        } else if (prev == 70) {
          setmsg("Order confirmed...");
        } else if (prev == 89) {
          setmsg("Pending on order through...");
        } else if (prev >= 90) {
          clearInterval(interval);
        }

        if (prev >= 90) {
          return prev;
        } else {
          return prev + 1;
        }
      });
    }, 120); // 每2秒滚动到下一条数据
    return () => {
      clearInterval(interval);
    };
  };

  useEffect(() => {
    if (!show) return;

    if (!transaction) {
      startProgress();
    } else {
      setprogress(100);
      setmsg("Completed");
    }
  }, [isLoading, show, transaction]);

  return (
    <div className={styles.errorContainer}>
      <Popup
        visible={show}
        bodyStyle={{
          backgroundColor: "#fff",
          borderRadius: "10px 10px 0 0",
        }}
        closeOnMaskClick={true}
        onClose={() => {
          hideErrorMessage?.();
        }}
      >
        <div className={styles.content}>
          {transaction ? (
            transaction.error ? (
              <div className={styles.oops}> Ops! </div>
            ) : (
              <div className={styles.oops}> Cheers! </div>
            )
          ) : (
            <div className={styles.oops}> Processing order... </div>
          )}
          <Image
            src={transationErrrorImg}
            alt=""
            width={175}
            height={177}
            className={styles.transationErrrorImg}
          />
          {transaction && transaction.error ? (
            <div className={styles.errorText}>{transaction.errorMessage}</div>
          ) : (
            <div className={styles.content}>{msg}</div>
          )}
          {transaction ? (
            <a
              href={`https://goerli.etherscan.io/tx/${transaction.transactionHash}`}
              target="_blank"
            >
              Check result on chain
            </a>
          ) : null}
          <div
            style={{ width: "80%", marginLeft: "30px", paddingBottom: "30px" }}
          >
            <ProgressBar percent={progress} text></ProgressBar>
          </div>

          <div onClick={hideErrorMessage} className={styles.okbutton}>
            OK
          </div>
        </div>
      </Popup>
    </div>
  );
};
