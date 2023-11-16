"use client";

import React, { useEffect } from "react";
import Footer from "@/components/custom/footer";
import LeftBar from "@/components/custom/leftBar";
import { Providers } from "@/components/custom/Providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setIsMobile } from "@/redux/features/userSlice";
import { spaceCheckStatus } from "@/service/userService";
import Notification from "@/components/custom/notification";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [showNotification, setShowNotification] = React.useState(false);

  const [detailMap, setDetailMap] = React.useState({
    newOwner: "owner",
    money: "0",
  });
  useEffect(() => {
    let timer = setInterval(() => {
      spaceCheckStatus().then((res) => {
        if (res.result.length > 0) {
          setShowNotification(true);
          const { newOwner, money } = JSON.parse(res.result[0]);
          setDetailMap({
            newOwner,
            money,
          });
        }
      });
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  React.useEffect(() => {
    const setRem = () => {
      const actualWidth =
        document.documentElement.clientWidth || document.body.clientWidth; // 实际宽度
      if (actualWidth > 431) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener("resize", setRem);
    return () => {
      window.removeEventListener("resize", setRem);
    };
  }, []);

  return (
    <Providers>
      <div className="hidden md:block">
        <LeftBar />
      </div>
      {children}
      <div className="md:hidden">
        <Footer />
      </div>
      <ToastContainer />
      <Notification
        show={showNotification}
        hideShow={() => {
          setShowNotification(false);
        }}
      >
        <div>
          Your place at What is next for RGB hosted by {detailMap.newOwner} has
          been outbid by others. You earned{" "}
          <span style={{ color: "red" }}>{detailMap.money}</span> ETH. Check
          your balance!
        </div>
      </Notification>
    </Providers>
  );
}
