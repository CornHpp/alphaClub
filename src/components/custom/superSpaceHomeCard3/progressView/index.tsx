import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getPercent, getTimeRemaining, localToUtc } from "@/lib/utils";
import progress from "@/assets/images/home/progress.png";
import bell from "@/assets/images/home/bell.png";
interface ProgressViewProps {
  item: allSpaceResponse;
}

const ProgressView: React.FC<ProgressViewProps> = ({ item }) => {
  const [biddingEndTime, setBiddingEndTime] = useState(
    getTimeRemaining(item?.biddingEndTtime),
  );

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setBiddingEndTime(getTimeRemaining(item?.biddingEndTtime));
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, [item]);
  return (
    <div className="h-[42px]">
      <div className="text-[#333333] text-[12px]">
        <span className="text-[#FF9500] text-[20px] font-bold">
          {biddingEndTime.hours}{" "}
        </span>
        hours{" "}
        <span className="text-[#FF9500] text-[20px] font-bold">
          {" "}
          {biddingEndTime.minutes}{" "}
        </span>
        mins left
      </div>

      <div className="w-[128px] h-[9px] relative   mt-[5px]">
        <Image
          src={progress}
          alt="progress"
          width={128}
          height={9}
        ></Image>
        <div
          className="absolute right-0 top-0 
            h-full rounded-[4px] bg-[#EDEDED]"
          style={{
            width:
              getPercent(
                localToUtc(item?.biddingEndTtime),
                localToUtc(item?.createTime),
              ) + "%",
          }}
        ></div>
        <Image
          className="absolute top-[-4.5px] w-[18px] h-[18px]
            "
          style={{
            right:
              getPercent(
                localToUtc(item?.biddingEndTtime),
                localToUtc(item?.createTime),
                item.title,
              ) + "%",
          }}
          src={bell}
          alt="bell"
          width={18}
          height={18}
        ></Image>
      </div>
    </div>
  );
};

export default ProgressView;
