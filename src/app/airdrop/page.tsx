"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import copyIcon from "@/assets/images/copyIcon.png";
import { copyTextToClipboardSafari } from "@/lib/utils";
import { NavBar } from "antd-mobile";

import { useSelector } from "react-redux";
import Image from "next/image";
import { getInviteCode } from "@/service/userService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import AirdropRule from "@/components/custom/airdropRule";
import Button from "@/components/ui/button";
import { getMyScore, getMyGroupScore } from "@/service/userService";

const Rewards = () => {
  //   const { userinfo } = useSelector((state: any) => state.user);
  const router = useRouter();

  const [inviteCodeList, setInviteCodeList] = useState<inviteCodeType[]>([
    {
      inviteCode: "AC-EarlyAccess",
    },
  ]);

  const [ownerScore, setOwnerScore] = useState<number>(0);

  const [mygroupScore, setGroupScore] = useState<number>(0);

  const getMyScoreFunc = () => {
    getMyScore().then((res) => {
      setOwnerScore(res.result.score);
    });
  };

  const getMyGroupScoreFunc = () => {
    getMyGroupScore().then((res) => {
      setGroupScore(res.result);
    });
  };

  useEffect(() => {
    // getInviteCode().then((res) => {
    //   const { result } = res;
    //   console.log(result);
    //   setInviteCodeList(result);
    // });
    getMyScoreFunc();
    getMyGroupScoreFunc();
  }, []);

  const copyInviteCode = (code: string) => {
    console.log(code);
    copyTextToClipboardSafari(code);
  };

  const [showAirdropRule, setShowAirdropRule] = useState(false);

  return (
    <div className={styles.exploreContainer}>
      <NavBar
        onBack={() => {
          router.back();
        }}
        className={styles.navBar}
      >
        <div className={styles.navBarTitle}>
          AirDrop
          {/* <Button
            onClick={() => {
              setShowAirdropRule(true);
            }}
            className={styles.moreBtn}
          >
            More
          </Button> */}
          {/* <Image
            src={questionMarkIcon}
            onClick={() => {
              setShowAirdropRule(true);
            }}
            width={15}
            height={15}
            alt=""
          ></Image> */}
        </div>
      </NavBar>

      <div className={styles.airdropTitle}>
        Points are the tickets to $ALPHA
      </div>
      <div className={styles.inviteCodeContent}>
        <div className={styles.inviteTitle}>Invite a Friend</div>

        {inviteCodeList.map((item, index) => {
          return (
            <div
              key={index + "q"}
              className={styles.inviteCodeItem}
              onClick={() => {
                copyInviteCode(item.inviteCode);
              }}
            >
              <div className={item.invitedTwitterUid ? styles.used : ""}>
                {item.inviteCode}
              </div>
              <div className={styles.copyIcon}>
                <Image
                  width={15}
                  height={15}
                  src={copyIcon}
                  alt=""
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.rankContent}>
        <div className="flex items-center justify-center flex-1 flex-col">
          <div className="font-bold text-base">Your Points</div>
          <div className="font-bold mt-2 text-2xl">{ownerScore}</div>
        </div>
        <div className="flex items-center justify-center flex-1 flex-col">
          <div className="font-bold text-base">Your rank</div>

          <div className={styles.button}>{mygroupScore} of 3 ETH</div>

          <div className={styles.progressBar}>
            <div
              style={{
                width: (mygroupScore / 3) * 100 + "%",
              }}
              className={styles.leftProgress}
            ></div>
            <div
              style={{
                width: (3 - mygroupScore / 3) * 100 + "%",
              }}
              className={styles.rightProgress}
            ></div>
          </div>

          <div className="font-bold mt-2">ETH Bid Goal</div>
        </div>
      </div>

      <AirdropRule
        hideAirDropRule={() => {
          setShowAirdropRule(false);
        }}
        show={showAirdropRule}
      ></AirdropRule>
    </div>
  );
};
export default Rewards;
