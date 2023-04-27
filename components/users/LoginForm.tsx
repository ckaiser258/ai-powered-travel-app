import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

const LoginForm: React.FC = () => {
  const { handleSubmit } = useForm();
  const onSubmit = async () => {
    await signIn("github");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <button type="submit">Sign in</button>
    </form>
  );
};

export default LoginForm;
