"use client";

import React, { useEffect, useState } from "react";
import Footer from "@/components/custom/footer";
import LeftBar from "@/components/custom/leftBar";
import { Providers } from "@/components/custom/Providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setIsMobile } from "@/redux/features/userSlice";
import { spaceCheckStatus } from "@/service/userService";
import Notification from "@/components/custom/notification";
import { sendTwitter } from "@/service/space";
import { BackGround } from "@/components/custom/pwaNotification";
import pwaIcon from "@/assets/images/logoColorful.png";
import Image from "next/image";

import "@/lib/appInsights";
import Toast from "@/components/custom/Toast/Toast";
import { leaveAppInsights } from "@/lib/appInsights";

// import VConsole from "vconsole";

// if (typeof window !== "undefined") {
//   new VConsole();
// }

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [useMobile, setUseMobile] = useState(false);

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
      leaveAppInsights();
    };
  }, []);

  React.useEffect(() => {
    const setRem = () => {
      const actualWidth =
        document.documentElement.clientWidth || document.body.clientWidth; // 实际宽度
      if (actualWidth > 431) {
        setIsMobile(true);
        setUseMobile(true);
      } else {
        setIsMobile(false);
        setUseMobile(false);
      }
    };

    window.addEventListener("resize", setRem);
    setRem();

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
      {useMobile && (
        <BackGround
          show={useMobile}
          opacity={0.9}
          hideShow={() => {
            console.log("hide");
          }}
        >
          <div
            className="w-[400px] h-[50vh] bg-white rounded-[20px] flex flex-col
            items-center justify-center
          "
          >
            <Image
              unoptimized
              className="mt-[-30px]"
              src={pwaIcon}
              height={375}
              width={225}
              alt="pwaIcon"
            ></Image>
            <div className="text-[24px] mt-[20px] w-[90%] text-center">
              PC Compatible version will be released soon, switch to phone to
              continue using the application (add it to home screen for best
              experience)
            </div>
          </div>
        </BackGround>
      )}
    </Providers>
  );
}
