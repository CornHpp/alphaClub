"use client";
import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { getBalance, getMyEarned } from "@/service/userService";

// import styles from "./index.module.scss";
let timer: any = null;

const CountUpViewEarn = () => {
  const [decimals, setDecimals] = React.useState(0);
  const [lastBalance, setLastBalance] = React.useState(0);

  const getBalanceFunction = async () => {
    const res = await getBalance();
    const result = String(res.result);
    const index = result.indexOf(".");
    let decimals = result.length - index - 1;
    setDecimals(decimals > 5 ? 5 : decimals);
    setLastBalance(Number(res.result));
  };

  useEffect(() => {
    getBalanceFunction();

    timer = setInterval(() => {
      getBalanceFunction();
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <CountUp
        decimals={decimals}
        start={0}
        end={lastBalance}
        duration={2.75}
        separator=","
      ></CountUp>
    </div>
  );
};

export default React.memo(CountUpViewEarn);
