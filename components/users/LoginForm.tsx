import { Button } from "@mui/material";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

const LoginForm: React.FC = () => {
  const { handleSubmit } = useForm();
  const onSubmit = async () => {
    await signIn("github");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        onClick={() => signIn("github")}
      >
        Sign in with GitHub
      </Button>
    </form>
  );
};

export default LoginForm;
