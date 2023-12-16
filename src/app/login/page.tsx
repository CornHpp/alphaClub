"use client";
import React, { use } from "react";
import AuthPagesWrapper from "@/components/custom/AuthPagesWrapper/AuthPagesWrapper";
import { useState, useCallback, useEffect } from "react";
import { TwitterLogin } from "@/components/custom/LoginBtns/TwitterLogin";
import { Checkbox } from "antd-mobile";
import { LoginFrame } from "@/components/custom/LoginFrame/LoginFrame";
import { verifyTwitterToken, infoType } from "@/service/auth";
import styles from "./index.module.scss";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/redux/features/userSlice";
import { useRouter } from "next/navigation";

import twitterIcon from "@/assets/images/login/x.png";

import { getUserInfo } from "@/service/userService";
import { toast } from "react-toastify";
import { BackGround } from "@/components/custom/pwaNotification";
import pwaIcon from "@/assets/images/logoColorful.png";
// import logo from "@/assets/images/"
import Image from "next/image";

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isAgree, setIsAgree] = useState<boolean>(true);
  const [BackGroundShow, setBackGroundShow] = useState(false);

  const showPwaNativeNotificationFunc = () => {
    if (window.matchMedia("(display-mode: fullscreen)").matches) {
    } else {
      const isShowPwaNotification = localStorage.getItem(
        "isShowPwaNotification",
      );
      const actualWidth =
        document.documentElement.clientWidth || document.body.clientWidth; // 实际宽度
      if (actualWidth < 431) {
        if (!isShowPwaNotification) {
          setBackGroundShow(true);
          localStorage.setItem("isShowPwaNotification", "true");
        }
      }
    }
  };

  // 获取分享码
  const getShareCode = () => {
    const urlParams: any = new URLSearchParams(window.location.search);
    const paramsObj: { [key: string]: string } = {};

    for (const [key, value] of urlParams.entries()) {
      paramsObj[key] = value;
    }
    localStorage.setItem("shareCode", paramsObj.shareCode);
    return paramsObj;
  };

  useEffect(() => {
    getShareCode();
  }, []);

  const [showSafariNotification, setShowSafariNotification] = useState(false);

  const showSafariBrowserNotificationFunc = () => {
    const isMobile = () => {
      const userAgent = navigator.userAgent;
      return /iPhone|iPad|iPod/.test(userAgent);
    };

    const Chrome = () => {
      return /Chrome/.test(navigator.userAgent);
    };

    console.log("isMobileSafari", isMobile());
    console.log("isSafari", Chrome());
    if (isMobile()) {
      toast("isMobile");
    }
    if (Chrome()) {
      toast("Chrome");
    }

    // 如果是手机，并且不是safari浏览器，提示使用safari浏览器
    if (isMobile() && !Chrome()) {
      setShowSafariNotification(true);
    }
  };
  useEffect(() => {
    showPwaNativeNotificationFunc();
    // showSafariBrowserNotificationFunc();
  }, []);

  // get personal info from the server cache to redux store
  const dispatch = useDispatch();

  const getQueryParams = useCallback((): any => {
    if (typeof window === "undefined") {
      return;
    }

    const urlParams: any = new URLSearchParams(window.location.search);
    const paramsObj: { [key: string]: string } = {};

    for (const [key, value] of urlParams.entries()) {
      paramsObj[key] = value;
    }

    return paramsObj;
  }, []);

  const getUserInfoFunction = useCallback(() => {
    getUserInfo().then((res) => {
      console.log(res);
      if (res.code == "200") {
        dispatch(setUserInfo(res.result));
        if (res.result.bindInviteCode) {
          router.push("/home");
        } else {
          router.push("/verifyCode");
        }
      }
    });
  }, [dispatch, router]);

  const params = getQueryParams();

  const validateTwitterToken = useCallback(async () => {
    console.log("validating twitter token");
    setIsLoading(true);
    verifyTwitterToken({
      oauth_token: params.oauth_token,
      oauth_verifier: params.oauth_verifier,
    } as infoType)
      .then(async (res: any) => {
        if (res) {
          localStorage.setItem("token", res.result);
          getUserInfo().then((res) => {
            console.log(res);
            dispatch(setUserInfo(res.result));
            if (res.result.bindInviteCode) {
              router.push("/home");
            } else {
              router.push("/verifyCode");
            }
          });
        } else {
          // todo: route to /root, reset the params. other wise will infinity fail.
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.oauth_token, params.oauth_verifier, router, dispatch]);

  useEffect(() => {
    if (params.oauth_token && params.oauth_verifier) {
      validateTwitterToken();
    } else {
      console.log("no token");
      getUserInfoFunction();
    }
  }, [
    params.oauth_token,
    params.oauth_verifier,
    validateTwitterToken,
    getUserInfoFunction,
  ]);

  const handleAgreeCheck = () => {
    setIsAgree(!isAgree);
  };

  return (
    <AuthPagesWrapper>
      <LoginFrame></LoginFrame>
      <div className={styles.loginBox}>
        <div className={styles.loginSubBox}>
          <TwitterLogin isAgree={isAgree}></TwitterLogin>
        </div>

        <div className={styles.buttonBox}>
          <Checkbox
            defaultChecked
            checked={isAgree}
            onChange={handleAgreeCheck}
            style={{
              "--icon-size": "1.125rem",
            }}
          ></Checkbox>

          <div style={{ paddingLeft: "7px" }}>
            {/*todo: 加一个agreement系统*/}
            <span className={styles.userAgreement}>
              《User agreement》
            </span> &{" "}
            <span className={styles.userAgreement}>《Privacy Policy》</span>
          </div>
        </div>
        {/*todo: 这里按下去跳转到咱们的twitter*/}
        <div className={styles.twitterName}>
          <Image
            src={twitterIcon}
            alt=""
            width={12}
            height={12}
          ></Image>
          <div>@tryalpha_club</div>
        </div>
      </div>

      <BackGround
        show={BackGroundShow}
        hideShow={() => {
          setBackGroundShow(false);
        }}
      >
        <div className={styles.pwaContent}>
          <Image
            unoptimized
            src={pwaIcon}
            height={375}
            width={225}
            alt="pwaIcon"
          ></Image>
          <div className={styles.titleContent}>Add To Home Screen</div>
          <div className={styles.contentDetail}>
            To install the app, you need to add this website to your home
            screen.
          </div>
          <div className={styles.contentDetail}>
            In your Safari browser menu, tap the Share icon and choose{" "}
            <span>Add to Home Screen</span> in the options.Then open the Alpha
            app on your home screen.
          </div>
        </div>
      </BackGround>

      <BackGround
        show={showSafariNotification}
        hideShow={() => {
          setShowSafariNotification(false);
        }}
      >
        <div className={styles.pwaContent}>
          <Image
            unoptimized
            src={pwaIcon}
            height={375}
            width={225}
            alt="pwaIcon"
          ></Image>
          <div className={styles.titleContent}>Please use safari browser</div>
          <div className={styles.contentDetail}>
            safari can better support bookmark
          </div>
        </div>
      </BackGround>
    </AuthPagesWrapper>
  );
};

export default Login;
