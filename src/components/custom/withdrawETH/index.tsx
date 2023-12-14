import React, { useEffect, useState } from "react";
import styles from "./index.module.less";
import { Mask } from "antd-mobile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendEth } from "@/service/cryptoService";
import { useSelector } from "react-redux";
import { getBalance } from "@/service/userService";
import Toast from "../Toast/Toast";
interface Props {
  showWithdraw: boolean;
  hideWithDraw: () => void;
}

const WithdrawETH: React.FC<Props> = (props) => {
  const [walletBalance, setWalletBalance] = useState("");
  const { showWithdraw, hideWithDraw } = props;
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState("");

  const handleTransferClick = () => {
    if (!amount) {
      return;
    }

    sendEth(address, Number(amount)).then((res) => {
      console.log("res: ", res);
      Toast.info("Transfer success");
      setAmount("");
      setAddress("");
      hideWithDraw();
    });
  };

  const onclickMax = async () => {
    setAmount(walletBalance);
  };

  useEffect(() => {
    getBalance().then((res) => {
      setWalletBalance(res.result);
    });
  }, []);

  return (
    <Mask
      visible={showWithdraw}
      onMaskClick={hideWithDraw}
    >
      <div className={styles.overlayContent}>
        <div className={styles.title}>Withdraw ETH</div>
        <div className={styles.explain}>
          Transfer Eth from your Alphaclub wallet to another wallet on Base
        </div>

        <Input
          type="text"
          className={styles.input}
          placeholder="Enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <Input
          type="number"
          className={styles.input}
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => {
            console.log("e.target.value: ", e.target.value);
            setAmount(e.target.value);
          }}
        />

        <div className={styles.balance}>
          Your balance:{walletBalance} ETH
          <div
            onClick={onclickMax}
            className={styles.buttonMax}
          >
            max
          </div>
        </div>

        <Button
          onClick={handleTransferClick}
          height={"2rem"}
          className={styles.transferButton}
        >
          Transfer
        </Button>
        <div
          className={styles.close}
          onClick={hideWithDraw}
        >
          Close
        </div>
      </div>
    </Mask>
  );
};

export default WithdrawETH;
