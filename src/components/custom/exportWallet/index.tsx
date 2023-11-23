import React, { useEffect } from "react";
import styles from "./index.module.scss";
import { Popup } from "antd-mobile";
import { MailOutline } from "antd-mobile-icons";
import step from "@/assets/images/earning/step.png";
import { Button } from "@/components/ui/button";
import { TextOutline } from "antd-mobile-icons";
import { copyTextToClipboard, filterString } from "@/lib/utils";
import { useSelector } from "react-redux";
import { exportWallet } from "@/service/userService";
import copy from "copy-to-clipboard";
import toaster from "@/components/custom/Toast/Toast";
import Image from "next/image";
import { copyTextToClipboardSafari } from "@/lib/utils";

interface Props {
  showWallet: boolean;
  hideWallet: (val: boolean) => void;
}

let lock = false;

const ExportWallet: React.FC<Props> = (props) => {
  const { showWallet, hideWallet } = props;

  const { userinfo } = useSelector((state: any) => state.user);

  const [privateKey, setPrivateKey] = React.useState("");

  const clickCopy = async () => {
    copyTextToClipboardSafari(privateKey);

    // toaster.success("Copied your key to clipboard, please keep it safe!");
    // lock = false;
  };
  useEffect(() => {
    if (showWallet && !privateKey) {
      exportWallet().then((res) => {
        setPrivateKey(res);
      });
    }
  }, [showWallet, privateKey]);
  return (
    <div className={styles.container}>
      <Popup
        visible={showWallet}
        onMaskClick={() => {
          hideWallet(false);
        }}
        bodyStyle={{
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        <div className={styles.popupBox}>
          <div className={styles.title}>
            <div className={styles.Transfer}>Export</div>
            <div className={styles.walletMessage}>
              <MailOutline className={styles.walletIcon} />
              {filterString(userinfo?.walletAddress || "")}
            </div>
          </div>
          <div className={styles.transferText}>
            You can take your account with you to another site using an external
            wallet!
          </div>

          <div className={styles.step}>
            <Image
              width={148}
              height={629}
              className={styles.stepImg}
              src={step}
              alt=""
            />
            <div className={styles.explain}>
              <div className={styles.choiceWallet}>
                Transfer your account to your wallet of choice
              </div>
              <div className={styles.copyKey}>
                Copy this key into your other wallet
              </div>
            </div>
          </div>
          <div className={styles.copyKeybutton}>
            <Button
              className={styles.button}
              onClick={clickCopy}
              id="copy"
            >
              <TextOutline className={styles.leftCopy}></TextOutline>
              Copy Key
            </Button>

            <div className={styles.warning}>
              <div className={styles.warningTitle}>WARNING</div>
              <div className={styles.warningText}>
                Never share your private key with anyone! it controls your
                account.
              </div>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default ExportWallet;
