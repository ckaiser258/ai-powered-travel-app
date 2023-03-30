import { signIn } from "next-auth/react";

const LoginForm: React.FC = () => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        signIn("github");
      }}
    >
      <button type="submit">Sign in</button>
    </form>
  );
};

export default LoginForm;
