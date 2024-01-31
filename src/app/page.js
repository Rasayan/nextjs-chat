
import styles from "../../styles/page.module.css";

export default function Home() {
  return (
    <div className={styles.main}>
      <div className={styles.homediv}>
        <div className={styles.versiondiv}>
          <p>v0.0.1</p>
        </div>
        <div className={styles.homedivheads}>
          <h1 id={styles.h1home}>Tracking Directions made Easy</h1>
          <h3 id={styles.h3home}>HIVEMAPPER</h3>
        </div>

        <div className={styles.homebuttondiv}>
          <button className={styles.homebutton}><a href="/mapz">Get Started</a></button>
          <button className={styles.homebutton}>See Docs!</button>
        </div>
      </div>
    </div>
  );
}
