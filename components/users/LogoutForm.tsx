import { Button } from "@mui/material";
import { signOut } from "next-auth/react";
import { useForm } from "react-hook-form";

const LogoutForm: React.FC = () => {
  const { handleSubmit } = useForm();
  const onSubmit = async () => {
    await signOut();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button
        type="submit"
        color="secondary"
        variant="contained"
        size="small"
        onClick={() => signOut()}
      >
        Sign out
      </Button>
    </form>
  );
};

export default LogoutForm;
