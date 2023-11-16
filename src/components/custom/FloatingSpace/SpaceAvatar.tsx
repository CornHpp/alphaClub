"use client";

import React from "react";
import { Avatar } from "antd-mobile";
import { RaisedHand } from "@azure/communication-calling";

import headerImg from "@/assets/images/home/headerImg.png";
import { RoomUser } from "@/service/roomService";
import { isParticipantHandRaised } from "./index";
import styles from "./index.module.scss";

function RaisedHand({
  identity,
  raisedHands,
}: {
  identity: SpaceAvatarProps["identity"];
  raisedHands: SpaceAvatarProps["raisedHands"];
}) {
  if (!identity || !raisedHands?.length) {
    return null;
  }

  return (
    isParticipantHandRaised({ communicationUserId: identity }, raisedHands) && (
      <div className="w-7 h-7 absolute -right-1 -top-2 text-xs bg-white rounded-full flex justify-center items-center shadow-[0px_0px_10px_rgba(196,_196,_196,_0.5)]">
        👋
      </div>
    )
  );
}

export type SpaceAvatarProps = {
  identity?: string;
  raisedHands?: RaisedHand[];
  userInfo?: Partial<RoomUser>;
  role: string;
};

export function SpaceAvatar({
  identity,
  raisedHands,
  userInfo,
  role,
}: SpaceAvatarProps) {
  return (
    <div className="flex flex-col gap-1 items-center">
      <div className="relative">
        <RaisedHand identity={identity} raisedHands={raisedHands} />
        <Avatar
          src={userInfo?.icon ?? headerImg.src}
          className={styles.avatar}
        />
      </div>
      <div className="text-center">
        <p className="text-[rgb(51,51,51)]">
          {userInfo?.displayName || userInfo?.twitterId || "Unknown User"}
        </p>
        <p className="text-[rgb(153,153,153)] text-xs">{role}</p>
      </div>
    </div>
  );
}
