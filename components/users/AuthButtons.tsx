import { useEffect } from "react";
import { useSession } from "next-auth/react";
import LoginForm from "./LoginForm";
import LogoutForm from "./LogoutForm";
import styles from "@/styles/AppBar.module.css";

const AuthButtons = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    // This will ensure that the HTML rendered on the client matches the HTML rendered on the server after login/logout
  }, []);

  return (
    <>
      {status === "authenticated" ? (
        <>
          <li className={styles.loginOrLogoutForm}>
            <p>Signed in as {session?.user?.name}</p>
          </li>
          <li className={styles.loginOrLogoutForm}>
            <LogoutForm />
          </li>
        </>
      ) : (
        <li className={styles.loginOrLogoutForm}>
          <LoginForm />
        </li>
      )}
    </>
  );
};

export default AuthButtons;
