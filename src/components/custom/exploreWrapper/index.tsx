import { useRouter } from "next/navigation";
import { NavBar } from "antd-mobile";
import Image from "next/image";
import leftAirBlack from "@/assets/images/airdrop/leftBack.png";
import styles from "./index.module.scss";

interface ExploreWrapperProps {
  Title: any;
  BgImg?: any;
  BgColor?: any;
  children: any;
}

export const ExploreWrapper = (props: ExploreWrapperProps) => {
  const router = useRouter();

  return (
    <div
      style={{
        backgroundImage: props.BgImg ? "url(".concat(props.BgImg, ")") : "",
        background: props.BgColor,
      }}
      className={styles.exploreWrapper}
    >
      <Image
        src={leftAirBlack}
        className={styles.leftAirBlack}
        width={333}
        height={568}
        style={{
          position: "absolute",
          left: "1rem",
          bottom: "7rem",
          zIndex: 1,
        }}
        alt=""
      />
      <Image
        src={leftAirBlack}
        className={styles.leftAirBlack}
        width={333}
        height={568}
        style={{
          position: "absolute",
          right: "1rem",
          top: "10rem",
          zIndex: 1,
        }}
        alt=""
      />
      <div
        style={{
          width: "100vw",
          maxWidth: "430px",
          margin: "0 auto",
          position: "relative",
          height: "100vh",
        }}
      >
        <div style={{ height: "15px" }}></div>
        <NavBar
          onBack={() => {
            router.back();
          }}
        >
          airdrop
        </NavBar>

        {props.children}
        <div
          style={{
            position: "absolute",
            background: "#000000",
            height: "5px",
            width: "134px",
            transform: "translate(-50%, -50%)",
            left: "50%",
            bottom: "7px",
            borderRadius: "2.5px",
          }}
        ></div>
      </div>
    </div>
  );
};
