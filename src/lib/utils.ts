"use client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import toaster from "@/components/custom/Toast/Toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 拷贝字符串到剪贴板
export const copyTextToClipboard = (value: string) => {
  navigator.clipboard
    .writeText(value)
    .then(() => {
      alert("复制成功！");
    })
    .catch(() => {
      alert("复制失败，请手动复制！");
    });
};

// 格式化字符串
export function filterString(str: string, num = 8 as number): string {
  if (!str) return "";
  return (
    str.slice(0, num + 2) + "..." + str.slice(str.length - num, str.length)
  );
}

export function formatDateCheers(inputDateStr: string | number): string {
  const dateObj = new Date(inputDateStr);

  const year = dateObj.getFullYear();
  const month = ("0" + (dateObj.getMonth() + 1)).slice(-2); // 添加前导零
  const day = ("0" + dateObj.getDate()).slice(-2); // 添加前导零
  const hours = ("0" + dateObj.getHours()).slice(-2); // 添加前导零
  const minutes = ("0" + dateObj.getMinutes()).slice(-2); // 添加前导零
  const seconds = ("0" + dateObj.getSeconds()).slice(-2); // 添加前导零

  const formattedDate =
    year +
    "-" +
    month +
    "-" +
    day +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  return formattedDate;
}

// safari 兼容复制功能
export function copyTextToClipboardSafari(text: string) {
  if (navigator.clipboard && window?.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toaster.success("Copied your key to clipboard, please keep it safe!");
      })
      .catch(() => {
        toaster.error("fail");
      });
  } else {
    // 创建text area
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "absolute";
    textArea.style.left = "-9999px";
    // 使text area不在viewport，同时设置不可见
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise<void>((resolve, reject) => {
      // 执行复制命令并移除文本框
      document.execCommand("copy") ? resolve() : reject(new Error("fail"));
      textArea.remove();
    }).then(
      () => {
        toaster.success("Copied your key to clipboard!");
      },
      () => {
        toaster.error("fail");
      }
    );
  }
}

// 格式化余额
export const formatBalanceNumber = (num: number, maxDecimals = 5) => {
  const result = String(num);
  const index = result.indexOf(".");
  let decimals = result.length - index - 1;

  return decimals > maxDecimals
    ? Number(num).toFixed(maxDecimals)
    : Number(num).toFixed(decimals);
};
