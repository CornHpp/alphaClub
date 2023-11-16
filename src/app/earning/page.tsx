"use client";
import React, { useEffect } from "react";
import styles from "./index.module.scss";
import deposit from "@/assets/images/earning/deposit.png";
import withdraw from "@/assets/images/earning/withdraw.png";
import exportIcon from "@/assets/images/earning/export.png";

import Image from "next/image";
import CountUp from "react-countup";
import { DepositView } from "@/components/custom/depositView";
import WithdrawETH from "@/components/custom/withdrawETH";
import ExportWallet from "@/components/custom/exportWallet";
import { getBalance, getMyEarned } from "@/service/userService";

import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";

const EarningPage = () => {
  const [lastEarned, setLastEarned] = React.useState(0);
  const [nowRank, setNowRank] = React.useState(0);

  const [lastBalance, setLastBalance] = React.useState(0);

  const [showDeposit, setDeposit] = React.useState(false);

  const [showWithdraw, setShowWithdraw] = React.useState(false);

  const [showWallet, setShowWallet] = React.useState(false);

  const [decimals, setDecimals] = React.useState(0);

  const getBalanceFunction = async () => {
    const res = await getBalance();
    console.log("getBalanceFunction", res.result);
    const result = String(res.result);
    const index = result.indexOf(".");
    let decimals = result.length - index - 1;
    console.log("decimals", decimals);
    setDecimals(decimals > 5 ? 5 : decimals);
    setLastBalance(Number(res.result));
  };

  const getMyEarnedFunction = async () => {
    getMyEarned().then((res) => {
      console.log("getMyEarned", res);
      setLastEarned(Number(res.result));
    });
  };

  useEffect(() => {
    getMyEarnedFunction();
    getBalanceFunction();
  }, []);

  const router = useRouter();

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
          {/* <Countdown title="Countdown" value={lastRank}  /> */}

          <CountUp
            decimals={decimals}
            start={0}
            end={lastEarned}
            duration={2.75}
            separator=","
          ></CountUp>

          <span className="text-lg"> ETH</span>
        </div>
      </div>

      <div className={styles.bottomBalance}>
        <div className={styles.leftBalance}>
          <div className="text-base">Balance</div>
          <div className="text-xl  mt-2">
            <CountUp
              start={0}
              end={lastBalance}
              duration={2.75}
              decimals={decimals}
              separator=","
            ></CountUp>
            <span className="text-base"> ETH</span>
          </div>
        </div>

        <div className="flex">
          <div
            className="flex flex-col items-center"
            onClick={() => {
              setDeposit(true);
            }}
          >
            <Image width={68} height={68} src={deposit} alt=""></Image>
            Deposit
          </div>
          <div
            className="flex flex-col items-center"
            onClick={() => {
              console.log("openWithdraw");
              setShowWithdraw(true);
            }}
          >
            <Image width={68} height={68} src={withdraw} alt=""></Image>
            Withdraw
          </div>
          <div
            className="flex flex-col items-center"
            onClick={() => {
              setShowWallet(true);
            }}
          >
            <Image width={68} height={68} src={exportIcon} alt=""></Image>
            Export
          </div>
        </div>
      </div>

      <DepositView
        balanceNumber={lastBalance}
        visible={showDeposit}
        setVisible={() => {
          setDeposit(false);
        }}
      ></DepositView>

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

export default EarningPage;
