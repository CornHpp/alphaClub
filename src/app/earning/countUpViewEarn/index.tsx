"use client";
import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { getBalance, getMyEarned } from "@/service/userService";

// import styles from "./index.module.scss";

const CountUpViewEarn = () => {
  const [lastEarned, setLastEarned] = React.useState(0);
  const [decimals, setDecimals] = React.useState(0);

  const getBalanceFunction = async () => {
    const res = await getBalance();
    console.log("getBalanceFunction", res.result);
    const result = String(res.result);
    const index = result.indexOf(".");
    let decimals = result.length - index - 1;
    setDecimals(decimals > 5 ? 5 : decimals);
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

  return (
    <div>
      <CountUp
        decimals={decimals}
        start={0}
        end={lastEarned}
        duration={2.75}
        separator=","
      ></CountUp>
    </div>
  );
};

export default React.memo(CountUpViewEarn);
