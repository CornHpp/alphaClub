"use client";
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { TabBar } from "antd-mobile";
import { usePathname, useRouter } from "next/navigation";
import Loading from "@/components/custom/Loading";

import { tabList } from "@/components/custom/footer/index";
import { showFullScreenLoading } from "@/service/config/serviceLoading";

// 应用底部展示tabBar的路由路径集合
const showFooterTabBarPathList = [
  "/home",
  "/myspace",
  "/createSpace",
  "/airdrop",
];

const LeftBar: React.FC = () => {
  const [isShow, setIsShow] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log("pathname", pathname);
    console.log("pathname1111111", pathname);

    const isShow = showFooterTabBarPathList.includes(pathname);
    setShowLoading(false);

    setIsShow(isShow);
    setActiveKey(pathname);
  }, [pathname]);

  //   const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("/home");
  const onTabChange = (val: string) => {
    setShowLoading(true);

    setActiveKey(val);

    router.push(val);
  };

  return isShow ? (
    <div className={styles.footer}>
      {tabList.map((item) => {
        return (
          <div
            className={[
              styles.footerItem,
              item.route === activeKey
                ? styles.footerItemTextActive
                : styles.footerItemText,
            ].join(" ")}
            key={item.id}
            onClick={() => {
              onTabChange(item.route);
            }}
          >
            {item.icon(item.route === activeKey)}
            <div
              className={
                item.route === activeKey
                  ? styles.footerItemTextActive
                  : styles.footerItemText
              }
            >
              {item.name}
            </div>
          </div>
        );
      })}
      {showLoading && <Loading />}
    </div>
  ) : null;
};
export default LeftBar;
