import styles from "./cssFolder/Loading.module.css";

const Loading = () => {
  return (
    <div className={styles.spinnerItem}>
      <div className={styles.dots}>
        <span className={styles.dot}></span>
        <span className={`${styles.dot} ${styles.delay}`}></span>
        <span className={styles.dot}></span>
      </div>
    </div>
  );
};

export default Loading;
