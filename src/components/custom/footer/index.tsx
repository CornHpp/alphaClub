"use client";
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { TabBar } from "antd-mobile";
import { usePathname, useRouter } from "next/navigation";
import home from "@/assets/images/footerBar/home.png";
import homeActive from "@/assets/images/footerBar/homeActive.png";
import Airdrop from "@/assets/images/footerBar/Airdrop.png";
import AirdropActive from "@/assets/images/footerBar/AirdropActive.png";
import mySpaces from "@/assets/images/footerBar/mySpaces.png";
import mySpaceActive from "@/assets/images/footerBar/mySpaceActive.png";
import Image from "next/image";

// 应用底部展示tabBar的路由路径集合
const showFooterTabBarPathList = [
  "/home",
  "/myspace",
  "/createSpace",
  "/airdrop",
];

const Footer: React.FC = () => {
  const [isShow, setIsShow] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isShow = showFooterTabBarPathList.includes(pathname);
    setIsShow(isShow);
    setActiveKey(pathname);
  }, [pathname]);

  //   const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("/home");
  const onTabChange = (val: string) => {
    setActiveKey(val);
    router.push(val);
  };

  return isShow ? (
    <div className={styles.footer}>
      <TabBar
        activeKey={activeKey}
        onChange={onTabChange}
        safeArea
        className={styles.tabBarWrap}
      >
        {tabList.map((item) => (
          <TabBar.Item
            key={item.route}
            icon={item.icon}
            title={item.name}
          />
        ))}
      </TabBar>
    </div>
  ) : null;
};
export default Footer;

function formatIcon(name: string, icon: any) {
  return (
    <Image
      unoptimized
      src={icon}
      alt={name}
      width={26}
      height={27}
    ></Image>
  );
}

export const tabList = [
  {
    id: 1,
    icon: (active: boolean) =>
      active ? formatIcon("Home", homeActive) : formatIcon("Home", home),
    name: "Home",
    route: "/home",
  },
  {
    id: 2,
    icon: (active: boolean) =>
      active ? formatIcon("Chat", mySpaceActive) : formatIcon("Chat", mySpaces),
    name: "myspace",
    route: "/myspace",
  },
  {
    id: 3,
    icon: (active: boolean) =>
      active
        ? formatIcon("airdrop", AirdropActive)
        : formatIcon("airdrop", Airdrop),
    name: "airdrop",
    route: "/airdrop",
  },
];
