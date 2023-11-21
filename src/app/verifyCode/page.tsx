"use client";
import React, { use } from "react";
import AuthPagesWrapper from "@/components/custom/AuthPagesWrapper/AuthPagesWrapper";
import { useState, useCallback, useEffect } from "react";
import { LoginFrame } from "@/components/custom/LoginFrame/LoginFrame";
import styles from "./index.module.scss";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import { toast } from "react-toastify";
import Image from "next/image";
import twitterIcon from "@/assets/images/login/x.png";

const Login: React.FC = () => {
  const router = useRouter();

  const [inviteCode, setInviteCode] = useState<string>(
    localStorage.getItem("inviteCode") || "",
  );
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

  const params = getQueryParams();

  const clickSubmitLogin = () => {
    if (!params.oauth_token || !params.oauth_verifier) {
      toast.error("Please login with twitter first");
      return;
    }
    if (!inviteCode) {
      toast.error("Please enter invite code");
      return;
    }
  };

  return (
    <AuthPagesWrapper>
      <LoginFrame></LoginFrame>
      <div className={styles.loginBox}>
        <Input
          type="text"
          className={styles.input}
          placeholder="New users need an invite code to Start!"
          value={inviteCode}
          onChange={(e) => {
            setInviteCode(e.target.value);
            localStorage.setItem("inviteCode", e.target.value);
          }}
        />

        <Button
          className={styles.submit}
          showBorderShodow={false}
          height="2.5rem"
          onClick={clickSubmitLogin}
        >
          Login
        </Button>

        <div className={styles.getFromTwitter}>Or get from our twitter 👇</div>

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
    </AuthPagesWrapper>
  );
};

export default Login;
