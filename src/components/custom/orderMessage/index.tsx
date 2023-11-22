import React, { useState, useEffect } from "react";
import { Popup } from "antd-mobile";
import styles from "./index.module.scss";
import logoColorful from "@/assets/images/logoColorful.png";
import { Button } from "antd-mobile";
import { useSelector } from "react-redux";
import { TranstionErrorMessage } from "@/components/custom/transtionErrorMessage";
import { toast } from "react-toastify";
import { buyShares, sellShares } from "@/service/cryptoService";
import Image from "next/image";

interface PopupBottomProps {
  sellOrbuy: boolean;
  hideSellOrbuy: () => void;
  transaction: any;
  completeStealSeat: () => void;
}

export const OrderMessage: React.FC<PopupBottomProps> = (props) => {
  const { sellOrbuy, hideSellOrbuy, transaction } = props;
  const { walletBalance } = useSelector((state: any) => state.crypto);
  const { userinfo } = useSelector((state: any) => state.user);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [transactionMsg, setTransactionMsg] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 点击完成购买
  const clickCompletePurchase = () => {
    // hideSellOrbuy();
    // 这里popup fails
    // 然后 purchase order
    getTransactionMessage();
  };

  // 获取transtion message
  const getTransactionMessage = async () => {
    props.completeStealSeat();
  };

  return (
    <div className={styles.container}>
      <TranstionErrorMessage
        show={showErrorMessage}
        hideErrorMessage={() => {
          console.log("hideErrorMessage");
          setShowErrorMessage(false);
        }}
        transaction={transactionMsg}
        isLoading={isLoading}
      ></TranstionErrorMessage>
      <Popup
        visible={sellOrbuy}
        closeOnMaskClick={true}
        onClose={() => {
          hideSellOrbuy();
        }}
        bodyStyle={{
          backgroundColor: "#fff",
          borderRadius: "10px 10px 0 0",
        }}
      >
        <div className={styles.buyOrSellPopup}>
          {/* <div className={styles.title}>Cheers to {transaction?.toDisplayName}!</div> */}
          <div className={styles.logoImg}>
            <Image
              width={146}
              height={88}
              src={logoColorful}
              alt=""
            />
          </div>
          <div className={styles.cheerText}>
            {/* Cheer {transaction?.amount} time
            {transaction?.amount == 1 ? null : "s"} for{" "}
            {transaction?.toDisplayName} */}
          </div>
          <div className={styles.table}>
            <div
              className={[styles.tableDefaultItem, styles.tableItem].join(" ")}
            >
              <div>Purchase Details</div>
              <div>{""}</div>
            </div>

            {/* <div className={[styles.tableDefaultItem].join(" ")}>
              <div className={styles.key}>to</div>
              <div className={styles.privacyKey}>
                {filterString(transaction?.reciverId)}
              </div>
            </div> */}
            <div className={[styles.tableDefaultItem].join(" ")}>
              <div className={styles.key}>Action</div>
              <div className={styles.privacyKey}>buy</div>
            </div>
            <div className={[styles.tableDefaultItem].join(" ")}>
              <div className={styles.key}>Price</div>
              <div className={styles.privacyKey}>
                {transaction?.biddingPrice} ETH
              </div>
            </div>
            <div className={[styles.tableDefaultItem].join(" ")}>
              <div className={styles.key}>Gas fee</div>
              <div className={styles.privacyKey}>{transaction?.gasFee}</div>
            </div>
            <div className={[styles.tableDefaultItem].join(" ")}>
              <div className={styles.key}>Total Cost</div>
              <div className={styles.privacyKey}>{transaction?.totalPrice}</div>
            </div>
            {/* <div className={[styles.tableDefaultItem].join(" ")}>
              <div className={styles.key}>From</div>
              <div className={styles.privacyKey}>
                {filterString(transaction?.senderId)}
              </div>
            </div> */}
            {/* <div className={[styles.tableDefaultItem].join(" ")}>
              <div className={styles.key}>
                <div className={styles.keyColor}>Total(includeing fees)</div>
                <div>2.508069 ETH</div>
              </div>
              <div className={[styles.privacyKey, styles.value].join(" ")}>
                <span>USD </span>${transaction?.gasUsed}
              </div>
            </div>
           */}
          </div>
          {transaction?.error ? (
            <div className={styles.text}>
              {/* wallet has insufficient funds to complete this transaction. Please */}
              {transaction?.errorMessage}
            </div>
          ) : null}
          {/* <div className={styles.inputAddress}>
            <div className={styles.privacyKey}>{walletBalance} available</div>
          </div> */}
          <Button
            block
            className={styles.button}
            onClick={clickCompletePurchase}
          >
            Complete purchase
          </Button>
        </div>
      </Popup>
    </div>
  );
};
