"use client";
import React, { useCallback, useEffect, useMemo } from "react";
import styles from "./index.module.scss";
import deposit from "@/assets/images/earning/deposit.png";
import withdraw from "@/assets/images/earning/withdraw.png";
import exportIcon from "@/assets/images/earning/export.png";

import Image from "next/image";
import CountUp from "react-countup";
import DepositView from "@/components/custom/depositView";
import WithdrawETH from "@/components/custom/withdrawETH";
import ExportWallet from "@/components/custom/exportWallet";
import { getBalance, getMyEarned } from "@/service/userService";

import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import CountUpViewEarn from "./countUpViewEarn";
import CountUpViewBalance from "./countUpViewBalance";

const EarningPage = () => {
  const [nowRank, setNowRank] = React.useState(0);

  const [showDeposit, setDeposit] = React.useState(false);

  const [showWithdraw, setShowWithdraw] = React.useState(false);

  const [showWallet, setShowWallet] = React.useState(false);
  const [lastBalance, setLastBalance] = React.useState(0);

  const router = useRouter();

  const getBalanceFunction = async () => {
    const res = await getBalance();
    setLastBalance(Number(res.result));
  };

  useEffect(() => {
    getBalanceFunction();
  }, []);

  const handleClick = useCallback(() => {
    setDeposit((prevDeposit) => !prevDeposit);
  }, []); // 注意这里的依赖项数组是空的，因为我们

  const MemoCountUP = React.memo(CountUp);
  return (
    <div className={styles.container}>
      <NavBar
        onBack={() => {
          router.back();
        }}
      >
        Earning
      </NavBar>
      <div className={styles.topEarned}>
        <div className="text-xl">You have earned</div>
        {/* <div className={styles.rank}>Rank:top5%</div> */}
        <div className="text-4xl mt-3">
          <CountUpViewEarn></CountUpViewEarn>
          {/* <MemoCountUP
            decimals={decimals}
            start={0}
            end={useLastEarned}
            duration={2.75}
            separator=","
          ></MemoCountUP> */}

          <span className="text-lg"> ETH</span>
        </div>
      </div>

      <div className={styles.bottomBalance}>
        <div className={styles.leftBalance}>
          <div className="text-base">Balance</div>
          <div className="text-xl  mt-2">
            <CountUpViewBalance></CountUpViewBalance>

            <span className="text-base"> ETH</span>
          </div>
        </div>

        <div className="flex">
          <div
            className="flex flex-col items-center"
            onClick={handleClick}
          >
            <Image
              width={68}
              height={68}
              src={deposit}
              alt=""
            ></Image>
            Deposit
          </div>
          <div
            className="flex flex-col items-center"
            onClick={() => {
              console.log("openWithdraw");
              setShowWithdraw(true);
            }}
          >
            <Image
              width={68}
              height={68}
              src={withdraw}
              alt=""
            ></Image>
            Withdraw
          </div>
          <div
            className="flex flex-col items-center"
            onClick={() => {
              setShowWallet(true);
            }}
          >
            <Image
              width={68}
              height={68}
              src={exportIcon}
              alt=""
            ></Image>
            Export
          </div>
        </div>
      </div>

      {showDeposit && (
        <DepositView
          successTransfer={() => {
            getBalanceFunction();
          }}
          visible={showDeposit}
          setVisible={() => {
            getBalanceFunction();

            setDeposit(false);
          }}
          balanceNumber={lastBalance}
        ></DepositView>
      )}

      <WithdrawETH
        hideWithDraw={() => {
          setShowWithdraw(false);
        }}
        showWithdraw={showWithdraw}
      ></WithdrawETH>

      <ExportWallet
        showWallet={showWallet}
        hideWallet={() => {
          setShowWallet(false);
        }}
      ></ExportWallet>
    </div>
  );
};

export default React.memo(EarningPage);
