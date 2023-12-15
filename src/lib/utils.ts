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
  // safari浏览器里的new Date(参数时间格式只支持"/"分割)，故而此处转一下
  return new Date(value);
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

  var date = new Date();

  try {
    date = new Date((value as string).split(".")[0]);
  } catch (e) {
    date = new Date(value);
  }

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

interface ParsedTime {
  year: string;
  month: string;
  date: string;
  hour: string;
  minute: string;
}
export const parseTimeValue = (
  value: string,
  serviceTime: boolean,
): ParsedTime => {
  if (!value) {
    return {
      year: "",
      month: "",
      date: "",
      hour: "",
      minute: "",
    };
  }
  let date = new Date(value);
  if (serviceTime) {
    value = value?.split(" ").join("T").concat("Z");
    let toLocalDate = new Date(value).toLocaleString("en-US", {});
    date = new Date(toLocalDate);
  }

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

  return {
    year: year.toString(),
    month: month.toString(),
    date: day.toString(),
    hour: hours.toString(),
    minute: minutes.toString(),
  };
};

// 计算时间差值
export function getTimeRemaining(targetDate: string) {
  const now = new Date();
  targetDate = targetDate?.split(" ").join("T").concat("Z");

  let toLocalDate = new Date(targetDate).toLocaleString("en-US", {});

  const target = new Date(toLocalDate);

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

export function formatDateIsEnd(
  inputDateStr: string,
  isSpace: boolean = false,
): string {
  const now = new Date();

  const target = new Date(inputDateStr);

  const timeDifference = Number(target) - Number(now);

  return timeDifference > 0 ? inputDateStr : isSpace ? "Ready" : "Ended";
}

// utc时间转换为本地时间
export function utcToLocal(time: string | Date) {
  const utcTime = formatDate(time, "yyyy-MM-dd hh:mm:ss");
  return utcTime;
}

// 本地时间转换为utc时间 在转成常用的格式

export function localToUtc(time: string) {
  time = time?.split(" ").join("T").concat("Z");

  let toLocalDate = new Date(time).toLocaleString("en-US", {});

  const target = new Date(toLocalDate);
  return formatDate(target, "yyyy-MM-dd hh:mm:ss");
}
// 判断当前时间是否大于传入时间
export const isTimeAfter = (time: string) => {
  const now = new Date();
  const target = new Date(time);

  return Number(now) > Number(target);
};

// 判断当前时间位于创建和结束时间的百分比
export const getPercent = (
  bidEndTime: string,
  createTime: string,
  title?: string,
) => {
  const localTime = new Date(); // 当前本地时间
  const start = new Date(createTime); // 开始时间
  const end = new Date(bidEndTime); // 结束时间

  const total = Number(end) - Number(start); // 总时间
  const current = Number(end) - Number(localTime); // 得到现在距离结束时间的毫秒数

  if (current < 0) {
    return 0;
  }

  const percent = ((current / total) * 100).toFixed(2); // 计算百分比

  if (Number(percent) > 85) {
    return 85;
  }

  return percent;
};
