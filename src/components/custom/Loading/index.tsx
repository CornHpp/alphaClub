import { DotLoading } from "antd-mobile";
import styles from "./index.module.scss";

interface Props {
  loadingText?: string;
}
const Loading: React.FC<Props> = (props) => {
  const { loadingText = "loading..." } = props;
  return (
    <div className={styles.blackBackground}>
      <div className={styles.loadingWrap}>
        <DotLoading color="white" />
        <span className={styles.loadingText}>{loadingText}</span>
      </div>
    </div>
  );
};

export default Loading;
