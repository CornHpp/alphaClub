"use client";

import React from "react";
import { Avatar, Popover } from "antd-mobile";
import { RaisedHand } from "@azure/communication-calling";
import { AudioMutedOutline, AudioOutline } from "antd-mobile-icons";
import { Action } from "antd-mobile/es/components/popover";

import headerImg from "@/assets/images/home/headerImg.png";
import { cn } from "@/lib/utils";
import { JoinedUser, isParticipantHandRaised } from "./index";
import styles from "./index.module.scss";

function RaisedHandIcon({ isHandRaised }: { isHandRaised?: boolean }) {
  if (!isHandRaised) {
    return null;
  }

  return (
    <div className="w-7 h-7 absolute -right-1 -top-2 text-xs bg-white rounded-full flex justify-center items-center shadow-[0px_0px_10px_rgba(196,_196,_196,_0.5)]">
      👋
    </div>
  );
}

const actions: Action[] = [
  {
    key: "unmute",
    icon: <AudioOutline className="w-4 h-4" />,
    text: "Unmute",
  },
  {
    key: "mute",
    icon: <AudioMutedOutline className="w-4 h-4" />,
    text: "Mute",
  },
];

export type SpaceAvatarProps = {
  raisedHands?: RaisedHand[];
  userInfo?: Partial<JoinedUser>;
  role: string;
  showClickMenu?: boolean;
  onMenuClick?: (key: string) => void;
};

export default function SpaceAvatar({
  userInfo,
  raisedHands,
  role,
  showClickMenu,
  onMenuClick,
}: SpaceAvatarProps) {
  const isHandRaised =
    !!userInfo?.identity &&
    isParticipantHandRaised(
      { communicationUserId: userInfo.identity },
      raisedHands
    );

  const avatarNode = (
    <div className="flex flex-col gap-1 items-center">
      <div
        className={cn(
          "relative rounded-full border-2 border-transparent transition",
          userInfo?.isSpeaking && "border-blue-500 border-opacity-100"
        )}
      >
        <RaisedHandIcon isHandRaised={isHandRaised} />
        <Avatar
          src={userInfo?.icon ?? headerImg.src}
          className={styles.avatar}
        />
      </div>
      <div className="flex flex-col items-center">
        <p className="text-[rgb(51,51,51)]">
          {userInfo?.displayName || userInfo?.twitterId || "Unknown User"}
        </p>
        <div className="flex gap-1 items-center relative">
          {!!userInfo?.isMuted && (
            <AudioMutedOutline className="absolute -left-4 top-1/2 -translate-y-1/2 " />
          )}
          <p className="text-[rgb(153,153,153)] text-xs">{role}</p>
        </div>
      </div>
    </div>
  );

  return showClickMenu ? (
    <Popover.Menu
      actions={actions}
      onAction={(node) => {
        onMenuClick?.(node.key! as string);
      }}
      placement="bottom-start"
      trigger="click"
    >
      {avatarNode}
    </Popover.Menu>
  ) : (
    avatarNode
  );
}
