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

import { Input } from "@/components/ui/input";

import { getUserInfo } from "@/service/userService";
import Button from "@/components/ui/button";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isAgree, setIsAgree] = useState<boolean>(true);

  const [inviteCode, setInviteCode] = useState<string>(
    localStorage.getItem("inviteCode") || ""
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

  const getUserInfoFunction = useCallback(() => {
    getUserInfo().then((res) => {
      console.log(res);
      dispatch(setUserInfo(res.result));
    });
  }, [dispatch]);

  const params = getQueryParams();

  const validateTwitterToken = useCallback(async () => {
    console.log("validating twitter token");
    setIsLoading(true);
    verifyTwitterToken({
      oauth_token: params.oauth_token,
      oauth_verifier: params.oauth_verifier,
      inviteCode: localStorage.getItem("inviteCode") || "",
    } as infoType)
      .then(async (res: any) => {
        if (res) {
          localStorage.setItem("token", res.result);
          getUserInfoFunction();
          router.push("/");
          localStorage.removeItem("inviteCode");
        } else {
          // todo: route to /root, reset the params. other wise will infinity fail.
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [getUserInfoFunction, params.oauth_token, params.oauth_verifier, router]);

  useEffect(() => {
    console.log("use effect");
    if (params.oauth_token && params.oauth_verifier) {
      validateTwitterToken();
    }
  }, [params.oauth_token, params.oauth_verifier, validateTwitterToken]);

  const clickSubmitLogin = () => {
    if (!params.oauth_token || !params.oauth_verifier) {
      toast.error("Please login with twitter first");
      return;
    }
    if (!inviteCode) {
      toast.error("Please enter invite code");
      return;
    }
    validateTwitterToken();
  };

  const handleAgreeCheck = () => {
    setIsAgree(!isAgree);
  };

  return (
    <AuthPagesWrapper>
      <LoginFrame></LoginFrame>
      <div className={styles.loginBox}>
        <Input
          type="text"
          className={styles.input}
          placeholder="New users need get an invite code to Start!"
          value={inviteCode}
          onChange={(e) => {
            setInviteCode(e.target.value);
            localStorage.setItem("inviteCode", e.target.value);
          }}
        />
        <div className={styles.loginSubBox}>
          <TwitterLogin isAgree={isAgree}></TwitterLogin>
        </div>

        {/* <Button
          className={styles.submit}
          showBorderShodow={false}
          height="2.5rem"
          onClick={clickSubmitLogin}
        >
          Login
        </Button> */}

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
            <span className={styles.userAgreement}>《User agreement》</span> &{" "}
            <span className={styles.userAgreement}>《Privacy Policy》</span>
          </div>
        </div>
      </div>
    </AuthPagesWrapper>
  );
};

export default Login;
