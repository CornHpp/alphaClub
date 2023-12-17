"use client";

import MySpace from "@/app/home/page";
import { LeaveInsights } from "@/lib/appInsights";
import { useEffect } from "react";
export default function Page({ params }: { params: { id: string } }) {
  useEffect(() => {
    return () => {
      LeaveInsights("my space");
    };
  }, []);
  return <MySpace isMySpace={true}></MySpace>;
}
