import Link from "next/link";
import styles from "@/styles/AppBar.module.css";
import AuthButtons from "./users/AuthButtons";

interface AppBarProps {
  title: string;
}

const AppBar: React.FC<AppBarProps> = ({ title }) => {
  return (
    <header className={styles.appBar}>
      <nav>
        <ul className={styles.navList}>
          <li>
            <Link href="/" className={styles.link}>
              <p>{title}</p>
            </Link>
          </li>
          <li>
            <Link href="/common-phrases" className={styles.link}>
              <p>Common Phrases Generator</p>
            </Link>
          </li>
          <li>
            <Link href="/exercises" className={styles.link}>
              <p>Language Exercise Generator</p>
            </Link>
          </li>
          <li>
            <Link href="/" className={styles.link}>
              <p>Translator</p>
            </Link>
          </li>
          <li>
            <Link href="/chat-bot" className={styles.link}>
              <p>Got other questions about travel? Ask our Chat Bot!</p>
            </Link>
          </li>
          <AuthButtons />
        </ul>
      </nav>
    </header>
  );
};

export default AppBar;
