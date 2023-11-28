import React from "react";
import styles from "./index.module.scss";
import closeIcon from "@/assets/images/airdrop/closeIcon.png";
import rule1 from "@/assets/images/airdrop/rule1.png";
import Image from "next/image";
import nextPageArrow from "@/assets/images/airdrop/nextPageArrow.png";

interface AirdropRuleProps {
  clickNextPage: () => void;
  hideAirdropRule: () => void;
}

const Invites: React.FC<AirdropRuleProps> = (props) => {
  const { clickNextPage, hideAirdropRule } = props;
  return (
    <div className={styles.content}>
      <div className={styles.title}>
        <div>Invites:</div>
        <Image
          src={closeIcon}
          alt=""
          width={30}
          height={30}
          onClick={() => {
            hideAirdropRule();
          }}
        ></Image>
      </div>
      <Image
        src={rule1}
        className={styles.ruleImg}
        alt=""
        width={186}
        height={330}
      ></Image>

      <div className={styles.ruleText}>
        <div>Direct Invitee =</div>
        <div>500 points + 20% of points they earn</div>
      </div>
      <div className={styles.ruleText}>
        <div>Invitee&apos;s Invitee =</div>
        <div>250 points + 10% of points they earn</div>
      </div>
      <div className={styles.ruleText}>
        <div>Invite active players -&gt; get a lot of points and</div>
        <div>move up the leaderboard.</div>
      </div>

      <div className={styles.pageCurrent}>1/3</div>

      <Image
        src={nextPageArrow}
        className={styles.nextPageArrow}
        alt=""
        width={22}
        height={22}
        onClick={() => {
          clickNextPage();
        }}
      ></Image>
    </div>
  );
};

export default React.memo(Invites);
