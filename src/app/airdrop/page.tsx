"use client";
import { useEffect, useState } from "react";

import { ExploreWrapper } from "@/components/custom/exploreWrapper";
import RewardsBackgroundImg from "@/assets/images/airdrop/rewardsBackground.png";
import rewardsRank from "@/assets/images/airdrop/rewards.png";
import styles from "./index.module.scss";
import copyIcon from "@/assets/images/copyIcon.png";
import { copyTextToClipboardSafari } from "@/lib/utils";
import { NavBar } from "antd-mobile";
import questionMarkIcon from "@/assets/images/airdrop/questionMarkIcon.png";

import { useSelector } from "react-redux";
import Image from "next/image";
import { getInviteCode } from "@/service/userService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import AirdropRule from "@/components/custom/airdropRule";
import Button from "@/components/ui/button";

const Rewards = () => {
  //   const { userinfo } = useSelector((state: any) => state.user);
  const router = useRouter();

  const [inviteCodeList, setInviteCodeList] = useState<inviteCodeType[]>([]);

  useEffect(() => {
    getInviteCode().then((res) => {
      const { result } = res;
      console.log(result);
      setInviteCodeList(result);
    });
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
          <Button
            onClick={() => {
              setShowAirdropRule(true);
            }}
            className={styles.moreBtn}
          >
            More
          </Button>
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
        Points are airdropped every week and will have future uses in cheers
      </div>
      <div className={styles.inviteCodeContent}>
        <div className={styles.inviteTitle}>Invite a Friend</div>

        {inviteCodeList.map((item, index) => {
          return (
            <div
              key={index + "q"}
              className={styles.inviteCodeItem}
            >
              <div className={item.invitedTwitterUid ? styles.used : ""}>
                {item.inviteCode}
              </div>
              <div
                className={styles.copyIcon}
                onClick={() => {
                  copyInviteCode(item.inviteCode);
                }}
              >
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
          <div className="font-bold mt-2 text-2xl">TBA</div>
        </div>
        <div className="flex items-center justify-center flex-1 flex-col">
          <div className="font-bold text-base">Your rank</div>
          {/* <Image
            className="mt-2"
            src={rewardsRank}
            alt=""
            width={100}
            height={22}
          ></Image> */}
          TBA
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
