import React from "react";
import styles from "./index.module.scss";
import closeIcon from "@/assets/images/airdrop/closeIcon.png";
import rule2 from "@/assets/images/airdrop/rule2.png";
import drowArrow from "@/assets/images/airdrop/drowArrow.png";
import Image from "next/image";
import nextPageArrow2 from "@/assets/images/airdrop/nextPageArrow2.png";
import lastPageArrow from "@/assets/images/airdrop/lastPageArrow.png";
import fileBorder from "@/assets/images/airdrop/fileBorder.png";

interface AirdropRuleProps {
  clickNextPage: () => void;
  hideAirdropRule: () => void;
  clickLastPage: () => void;
}

const Squad: React.FC<AirdropRuleProps> = (props) => {
  const { clickNextPage, hideAirdropRule, clickLastPage } = props;
  return (
    <div className={styles.content}>
      <div className={styles.leftContent}>
        <div className={styles.title}>Squad:</div>
        <div className={styles.ruleContent}>
          <Image
            className={styles.rule2}
            src={rule2}
            alt=""
            width={145}
            height={210}
          ></Image>

          <Image
            src={drowArrow}
            className={styles.drowArrow}
            alt=""
            width={16}
            height={25}
          ></Image>

          <div className={styles.button}>2 of 3 ETH</div>

          <div className={styles.progressBar}>
            <div className={styles.leftProgress}></div>
            <div className={styles.rightProgress}></div>
          </div>

          <div className="font-bold mt-4">ETH Bid Goal</div>

          <Image
            src={drowArrow}
            className={styles.drowArrow}
            alt=""
            width={16}
            height={25}
          ></Image>

          <div className={styles.file}>
            <Image
              src={fileBorder}
              className={styles.fileBorder}
              alt=""
              width={80}
              height={69}
            ></Image>
            <div className="mt-2 font-bold">100-9999 Points</div>
          </div>
        </div>
      </div>
      <div className={styles.rightContent}>
        <div className={styles.closeIcon}>
          <Image
            src={closeIcon}
            onClick={() => {
              hideAirdropRule();
            }}
            alt=""
            width={30}
            height={30}
          ></Image>
        </div>

        <div className="font-bold w-3/4 mx-auto text-center text-lg mt-20">
          Your Squad
        </div>
        <div className="font-bold w-3/4 mx-auto text-center text-lg mt-28">
          CompleteSquad Goal
        </div>
        <div className="font-bold w-3/4 mx-auto text-center text-lg mt-28">
          Free Pointsto Flip
        </div>
      </div>

      <div className={styles.pageCurrent}>2/3</div>

      <Image
        src={nextPageArrow2}
        className={styles.nextPageArrow2}
        alt=""
        width={22}
        height={22}
        onClick={() => {
          clickNextPage();
        }}
      ></Image>

      <Image
        src={lastPageArrow}
        className={styles.lastPageArrow}
        alt=""
        width={22}
        height={22}
        onClick={() => {
          clickLastPage();
        }}
      ></Image>
    </div>
  );
};

export default React.memo(Squad);
