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
      },
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

/**
 * @description 格式化时间--转为date
 * @param {String} value 传入的时间
 * @returns string
 */
export const getCommonDate = (value: string | number | Date): Date => {
  // safary浏览器里的new Date(参数时间格式只支持"/"分割)，故而此处转一下
  if (typeof value === "string") {
    value = value.replace(/[^\d: ]/g, "/");
  }
  const date = new Date(value);
  return date;
};

/**
 * @description 格式化时间
 * @param {String | Number | Date} value 传入的时间
 * @param {String} pattern 格式化模式
 * @returns string
 */
export const formatDate = (
  value: string | number | Date,
  pattern?: string,
): string => {
  if (!value) {
    return "";
  }
  const date = getCommonDate(value);
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const seconds =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  const format = pattern || "yyyy/MM/dd hh:mm:ss";
  const formatObj: any = {
    yyyy: year,
    MM: month,
    dd: day,
    hh: hours,
    mm: minutes,
    ss: seconds,
  };
  const str = format.replace(/(yyyy|MM|dd|hh|mm|ss)/g, (match: string) => {
    const value = formatObj[match];
    return value || 0;
  });
  return str;
};

// 在时间的基础上添加指定小时数
export function addHoursToTime(inputTime: string, hoursToAdd: number) {
  // 将时间字符串转换为Date对象
  var inputDate = new Date(inputTime);
  // 添加指定小时数
  inputDate.setHours(inputDate.getHours() + hoursToAdd);

  return formatDate(inputDate, "yyyy-MM-dd hh:mm:ss");
}

// 计算时间差值
export function getTimeRemaining(targetDate: string) {
  const now = new Date();
  const target = new Date(targetDate);

  // 计算时间差值（以毫秒为单位）
  const timeDifference = Math.max(0, Number(target) - Number(now));

  // 计算小时、分钟
  const hours = Math.floor(timeDifference / (1000 * 60 * 60))
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)
    .toString()
    .padStart(2, "0");

  return {
    hours,
    minutes,
    seconds,
  };
}

export function formatDateIsEnd(inputDateStr: string): string {
  const now = new Date();

  const target = new Date(inputDateStr);

  const timeDifference = Number(target) - Number(now);

  return timeDifference > 0 ? inputDateStr : "end";
}
