"use client";
import { NavBar, Result } from "antd-mobile";
import { useRouter } from "next/navigation";
import React from "react";

const BuySuccessPage: React.FC = () => {
  const router = useRouter();

  return (
    <div
      className="w-screen h-screen flex item-center flex-col "
      style={{
        background: "var(--pageBackground)",
      }}
    >
      <NavBar
        onBack={() => {
          router.back();
        }}
      >
        Success
      </NavBar>
      <Result
        style={{
          width: "90%",
          margin: "0 auto",
          background: "none",
          marginTop: "40%",
        }}
        status="success"
        title="Successful"
        description="buy successd"
      />
    </div>
  );
};

export default BuySuccessPage;
