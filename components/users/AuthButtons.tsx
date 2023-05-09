import { useEffect } from "react";
import { useSession } from "next-auth/react";
import LoginForm from "./LoginForm";
import LogoutForm from "./LogoutForm";

const AuthButtons = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    // This will ensure that the HTML rendered on the client matches the HTML rendered on the server after login/logout
  }, []);

  return status === "authenticated" ? (
    <>
      Signed in as {session?.user?.name}
      <LogoutForm />
    </>
  ) : (
    <LoginForm />
  );
};

export default AuthButtons;
