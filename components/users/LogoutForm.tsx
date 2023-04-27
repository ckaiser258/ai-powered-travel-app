import { signOut } from "next-auth/react";
import { useForm } from "react-hook-form";

const LogoutForm: React.FC = () => {
  const { handleSubmit } = useForm();
  const onSubmit = async () => {
    await signOut();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <button type="submit">Sign out</button>
    </form>
  );
};

export default LogoutForm;
