import CirclePNG from "./circle.png";
import EthLogoPNG from "./ethlogo.png";
import LogoPNG from "@/assets/images/logo.png";
import Image from "next/image";
import styles from "./index.module.scss";

export const LoginFrame = () => {
  return (
    <div className={styles.loginFrame}>
      <Image
        style={{
          position: "absolute",
        }}
        src={EthLogoPNG}
        alt="EthLogoPNG"
        width={178}
        height={240}
      ></Image>
      <Image
        style={{
          position: "absolute",
          left: "-116px",
          top: "-54px",
        }}
        src={CirclePNG}
        alt="CirclePNG"
        width={386}
        height={386}
      ></Image>
      <Image
        style={{
          position: "absolute",
          transform: "translateX(-50%)",
          top: "20%",
          left: "50%",
        }}
        src={LogoPNG}
        alt="LogoPNG"
        height={375}
        width={225}
      ></Image>
    </div>
  );
};
