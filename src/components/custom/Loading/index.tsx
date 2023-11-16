import styles from "./index.module.scss";

interface Props {
  loadingText?: string;
}
const Loading: React.FC<Props> = (props) => {
  const { loadingText = "loading..." } = props;
  return (
    <div className={styles.blackBackground}>
      <div className={styles.loadingWrap}>
        {/* <CircularProgress
          sx={{
            color: "#FED335",
            width: "50px !important",
            height: "50px !important",
          }}
        /> */}
        <span className={styles.loadingText}>{loadingText}</span>
      </div>
    </div>
  );
};

export default Loading;
