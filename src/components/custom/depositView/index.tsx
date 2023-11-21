import React, { useState, useCallback, useEffect } from "react";
import styles from "./index.module.scss";
import Button from "@/components/ui/button";
import { PicturesOutline } from "antd-mobile-icons";
import { copyTextToClipboardSafari, formatBalanceNumber } from "@/lib/utils";
import ETH from "@/assets/images/earning/eth.png";
import { filterString } from "@/lib/utils";
import { getEthBalance } from "@/service/cryptoService";
import { Input, Popup } from "antd-mobile";
import { useDispatch, useSelector } from "react-redux";
// import toast from "@/components/custom/Toast/Toast";
import { setWalletBalance } from "@/redux/features/cryptoSlice";
import WalletConnectButton from "@/components/custom/wallectConectButton";
// import { useMoneyHook } from "hook/useMoneyHook";
import Image from "next/image";
import { useAccount, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { getBalance } from "@/service/userService";
import { toast } from "react-toastify";
import CopyIcon from "@/assets/images/earning/copy.png";

interface walletMapType {
  address: string;
  balance: number;
  balanceNumber: number;
}
interface DepositViewProps {
  clickCopy?: () => void;
  visible?: boolean;
  setVisible: (val: boolean) => void;
  balanceNumber?: number;
  successTransfer: () => void;
}
let timer: any = null;
export const DepositView: React.FC<DepositViewProps> = (props) => {
  const { visible, setVisible, balanceNumber, successTransfer } = props;
  const { userinfo } = useSelector((state: any) => state.user);

  const [walletMap, setWalletMap] = useState<walletMapType>({
    address: userinfo.walletAddress,
    balance: 0,
    balanceNumber: balanceNumber || 0,
  });

  const getBalanceFunction = useCallback(() => {
    getBalance().then((res) => {
      if (Number(res.result) === walletMap.balanceNumber) return;
      toast.success("Transfer success");
      setWalletMap({
        address: userinfo.walletAddress,
        balance: res.result,
        balanceNumber: Number(res.result),
      });
      successTransfer();
    });
  }, [userinfo.walletAddress, walletMap.balanceNumber, successTransfer]);

  useEffect(() => {
    if (!visible) {
      clearInterval(timer);
      return;
    }
    timer = setInterval(() => {
      getBalanceFunction();
    }, 7000);
    return () => {
      clearInterval(timer);
    };
  }, [visible, getBalanceFunction]);

  const clickCopy = () => {
    copyTextToClipboardSafari(walletMap?.address);
  };

  const [transferAmount, setTransferAmount] = useState<string>();
  const { address, isConnected } = useAccount();
  // const { config, error, isError } = usePrepareSendTransaction({
  //   to: address,
  //   value: parseEther(transferAmount),
  // })
  const { data, isLoading, isSuccess, sendTransactionAsync, error, isError } =
    useSendTransaction({
      to: userinfo.walletAddress,
      value: parseEther(transferAmount ?? "0.01"),
    });

  return (
    <>
      <Popup
        getContainer={() => document.getElementById("root") as HTMLElement}
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
        bodyStyle={{
          borderTopLeftRadius: "2rem",
          borderTopRightRadius: "2rem",
        }}
      >
        <div className={styles.openDeposit}>
          <div className={styles.title}>Let{"'"}s deposit some ETH.</div>
          <div className={[styles.title, styles.smallTitle].join(" ")}>
            You need some ETH in your wallet to get started.
          </div>

          <WalletConnectButton />

          {isConnected ? (
            <>
              <div className="mt-6 mb-12 flex flex-col gap-1">
                <div className="flex gap-4 items-center">
                  <Input
                    type="number"
                    placeholder="Enter the amount to transfer to your cheers wallet"
                    autoFocus
                    value={transferAmount}
                    onChange={(x) => {
                      setTransferAmount(x);
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => sendTransactionAsync?.()}
                    isLoading={isLoading}
                    height="32px"
                  >
                    Transfer
                  </Button>
                </div>

                {isError && (
                  <div className="text-red-600">
                    {(error as undefined | { shortMessage?: string })
                      ?.shortMessage ?? error?.message}
                  </div>
                )}
              </div>

              {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
            </>
          ) : (
            <>
              <div
                className={[
                  styles.title,
                  styles.smallTitle,
                  styles.marginTop,
                ].join(" ")}
              >
                Transfer with address
              </div>

              <Button
                onClick={clickCopy}
                textColor={"rgba(0, 0, 0, 1)"}
                backgroundColor={"rgba(254, 211, 53, 1)"}
                width="100%"
                height="3.1rem"
                className="font-bold relative"
              >
                {filterString(walletMap?.address)}
                <Image
                  src={CopyIcon}
                  alt=""
                  width={20}
                  height={20}
                  className={styles.copyIcon}
                />
              </Button>

              <div className={[styles.balance, styles.marginTop].join(" ")}>
                <div className={[styles.title, styles.balanceText].join(" ")}>
                  Balance:{" "}
                </div>
                <Button
                  width={"50%"}
                  textColor={"rgba(0, 0, 0, 1)"}
                  backgroundColor={"rgba(254, 211, 53, 1)"}
                >
                  <div className="flex item-center">
                    <Image
                      width={22}
                      height={22}
                      src={ETH}
                      className={styles.ethIcon}
                      alt=""
                    />
                    {formatBalanceNumber(walletMap?.balanceNumber)}
                  </div>
                </Button>
              </div>
            </>
          )}
        </div>
      </Popup>
    </>
  );
};

export default React.memo(DepositView);
