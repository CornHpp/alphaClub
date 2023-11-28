import React, { useEffect } from "react";
import styles from "./index.module.scss";
import Invites from "./invites";
import Squad from "./squad";
import ActivePage from "./activites";
import { Mask } from "antd-mobile";
interface AirdropRuleProps {
  show: boolean;
  hideAirDropRule: () => void;
}

const AirdropRule: React.FC<AirdropRuleProps> = (props) => {
  const { show, hideAirDropRule } = props;
  const [currentRule, setCurrentRule] = React.useState("invites");

  useEffect(() => {
    setCurrentRule("invites");
  }, [show]);
  return (
    show && (
      <Mask
        visible={show}
        onMaskClick={() => {
          hideAirDropRule();
        }}
      >
        <div className={styles.overlayContent}>
          {currentRule === "invites" && (
            <Invites
              clickNextPage={() => {
                setCurrentRule("squad");
              }}
              hideAirdropRule={() => {
                hideAirDropRule();
              }}
            ></Invites>
          )}
          {currentRule === "squad" && (
            <Squad
              clickLastPage={() => {
                setCurrentRule("invites");
              }}
              hideAirdropRule={() => {
                hideAirDropRule();
              }}
              clickNextPage={() => {
                setCurrentRule("activites");
              }}
            ></Squad>
          )}
          {currentRule === "activites" && (
            <ActivePage
              clickLastPage={() => {
                setCurrentRule("squad");
              }}
              hideAirdropRule={() => {
                hideAirDropRule();
              }}
            ></ActivePage>
          )}
        </div>
      </Mask>
    )
  );
};

export default AirdropRule;
