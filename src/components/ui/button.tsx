"use client";
import React from "react";
import { Loading } from "antd-mobile";
import { cn } from "@/lib/utils";
import styles from "./index.module.scss";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  textColor?: string;
  showBorderShodow?: boolean;
  maxWidth?: string;
  isLoading?: boolean;
  id?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  onClick,
  width,
  height,
  backgroundColor,
  textColor,
  showBorderShodow = true,
  maxWidth,
  isLoading,
  id,
  disabled,
}) => {
  return (
    <div
      id={id}
      className={cn(
        styles.button,
        className,
        showBorderShodow ? styles.showShowColor : "",
        disabled && "bg-gray-500!"
      )}
      onClick={() => !disabled && onClick?.()}
      style={{
        width: width,
        height: height,
        backgroundColor: backgroundColor,
        color: textColor,
        maxWidth: maxWidth,
      }}
    >
      {isLoading ? <Loading /> : children}
    </div>
  );
};

export default Button;
