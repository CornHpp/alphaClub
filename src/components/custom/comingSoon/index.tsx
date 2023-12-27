import React from "react";
import comingSoonIcon from "@/assets/images/home/404.png";
import Image from "next/image";

interface ComingSoonProps {}

const ComingSoon: React.FC<ComingSoonProps> = () => {
  return (
    <div className="w-full flex flex-col items-center pt-[80px]">
      <Image
        src={comingSoonIcon}
        alt=""
        width={210}
        height={180}
        className="w-[210px] h-[180px]"
      ></Image>

      <div className="w-full px-[32px] text-[12px] mt-[12px]">
        Get ready for a digital innovation extravaganza as we unveil the
        curtain! Are you prepared? Coming soon!
      </div>
    </div>
  );
};

export default ComingSoon;
