"use client";
import React, { use } from "react";
import AuthPagesWrapper from "@/components/custom/AuthPagesWrapper/AuthPagesWrapper";
import { useState, useCallback, useEffect } from "react";
import { LoginFrame } from "@/components/custom/LoginFrame/LoginFrame";
import styles from "./index.module.scss";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import { toast } from "react-toastify";
import Image from "next/image";
import twitterIcon from "@/assets/images/login/x.png";
import { bindInviteCode } from "@/service/userService";

const Login: React.FC = () => {
  const router = useRouter();

  const [inviteCode, setInviteCode] = useState<string>("");

  const clickSubmitLogin = () => {
    if (!inviteCode) {
      toast.error("Please enter invite code");
      return;
    }

    bindInviteCode(inviteCode).then((res) => {
      router.push("/home");
    });
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
