import { signOut } from "next-auth/react";
import { useForm } from "react-hook-form";

const LogoutForm: React.FC = () => {
  const { handleSubmit } = useForm();
  const onSubmit = async () => {
    await signOut();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="submit" value="Sign out" />
    </form>
  );
};

export default LogoutForm;
