import { signOut } from "next-auth/react";

const LogoutForm: React.FC = () => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        signOut();
      }}
    >
      <button type="submit">Sign out</button>
    </form>
  );
};

export default LogoutForm;
