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
import { sendTwitter } from "@/service/space";

import Toast from "@/components/custom/Toast/Toast";

// import VConsole from "vconsole";

// if (typeof window !== "undefined") {
//   new VConsole();
// }

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [showNotification, setShowNotification] = React.useState(false);

  const [detailMap, setDetailMap] = React.useState({
    host: "owner",
    money: "0",
    title: "title",
  });
  useEffect(() => {
    let timer = setInterval(() => {
      if (!localStorage.getItem("token")) {
        return;
      }
      spaceCheckStatus().then((res) => {
        if (res?.result?.length > 0) {
          setShowNotification(true);
          const { host, money, title } = JSON.parse(res.result[0]);
          setDetailMap({
            host,
            money,
            title,
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

  const clickMakeTwitter = () => {
    const str = `My seat was stolen at ${detailMap.title}, lost my alpha :( but earned ${detailMap.money} ETH, come join us @tryalpha_club, where winner Chads unite. `;
    sendTwitter(str).then((res) => {
      console.log(res);
      Toast.success("Twitter sent successfully");
      setShowNotification(false);
    });
  };

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
        clickMakeTwitter={clickMakeTwitter}
        show={showNotification}
        hideShow={() => {
          setShowNotification(false);
        }}
      >
        <div>
          Your place at {detailMap.title} for {detailMap.host} hosted by has
          been outbid by others. You earned{" "}
          <span style={{ color: "red" }}>{detailMap.money}</span> ETH. Check
          your balance!
        </div>
      </Notification>
    </Providers>
  );
}
