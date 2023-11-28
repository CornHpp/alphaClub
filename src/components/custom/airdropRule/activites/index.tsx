import React from "react";
import styles from "./index.module.scss";
import closeIcon from "@/assets/images/airdrop/closeIcon.png";
import rule1 from "@/assets/images/airdrop/rule1.png";
import Image from "next/image";
import nextPageArrow from "@/assets/images/airdrop/nextPageArrow.png";
import peopleIcon from "@/assets/images/airdrop/peopleIcon.png";
import drowArrow from "@/assets/images/airdrop/drowArrow.png";
import fileBorder from "@/assets/images/airdrop/fileBorder.png";
import lastPageArrow from "@/assets/images/airdrop/lastPageArrow.png";

interface AirdropRuleProps {
  clickLastPage: () => void;
  hideAirdropRule: () => void;
}

const ActivePage: React.FC<AirdropRuleProps> = (props) => {
  const { clickLastPage, hideAirdropRule } = props;
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

      <div className="w-full mt-6 font-bold">Bid for a seat = 250 points</div>
      <div className="font-bold">
        Created room is bid on by others = 250 points Bid 3 times weekly =
        Points card flip
      </div>
      <div className="w-full mt-4 font-bold">
        Enjoy the playground -&gt; Get a lot of points
      </div>

      <Image
        src={peopleIcon}
        alt=""
        width={55}
        height={55}
        className="mt-6"
        onClick={() => {
          hideAirdropRule();
        }}
      ></Image>

      <div className={styles.button}>
        Bid & Earn 7.263 ETH when you get outbidded
      </div>

      <div className="font-bold ">+250 Points (host/Bidder)</div>
      <div className="font-bold text-xl mt-1">3 times/Week</div>

      <Image
        src={drowArrow}
        className="mt-6"
        alt=""
        width={16}
        height={25}
      ></Image>

      <div className="flex mt-2 items-center">
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
        <div className="ml-8 font-bold text-xl text-center">
          <div>Free Points</div>
          <div>Flip</div>
        </div>
      </div>
      <div className={styles.pageCurrent}>3/3</div>

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

export default React.memo(ActivePage);
