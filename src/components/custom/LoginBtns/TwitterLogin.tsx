"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import styles from "./index.module.scss";
import xTwitter from "@/assets/images/login/x.png";
import toast from "@/components/custom/Toast/Toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
interface TwitterLoginProps {
  isAgree: boolean;
}

export const TwitterLogin: React.FC<TwitterLoginProps> = (props) => {
  const { isAgree } = props;
  const handleLogin = async () => {
    if (!isAgree) {
      console.log("isAgree", isAgree);
      toast.error("Please agree to the User agreement and Privacy Policy");
      return;
    }
    try {
      window.location.href =
        process.env.NEXT_PUBLIC_APP_URL + "/open/x/oauth/request_token";
    } catch (error) {
      console.error("Failed to fetch Twitter auth URL", error);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      backgroundColor="var(--tabTextColorActive)"
      textColor="var(--TextColorBlack)"
      showBorderShodow={false}
      width="100%"
      height="2.5rem"
    >
      <span>Login with</span>
      <Image
        width={16}
        height={16}
        src={xTwitter}
        className={styles.xTwitter}
        alt=""
      />
      （Twitter）
    </Button>
  );
};
