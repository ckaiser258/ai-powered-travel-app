import { Button } from "@mui/material";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

const LoginForm: React.FC = () => {
  const { handleSubmit } = useForm();

  const onSubmit = async () => {
    await signIn("github");
  };

  return (
    // Making this a form in case we want to add more fields later
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button type="submit" variant="contained" color="secondary">
        Sign in with GitHub
      </Button>
    </form>
  );
};

export default LoginForm;
