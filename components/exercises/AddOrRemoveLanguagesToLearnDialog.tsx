import {
  Alert,
  Dialog,
  DialogTitle,
  Snackbar,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/router";
import { ApolloQueryResult, OperationVariables } from "@apollo/client";
import React, { useState } from "react";
import { Close } from "@mui/icons-material";
import { Query } from "@/generated/graphql";
import AddLanguagesToLearnForm from "./AddLanguagesToLearnForm";
import RemoveLanguagesToLearnForm from "./RemoveLanguagesToLearnForm";

interface AddOrRemoveLanguagesToLearnDialogProps {
  open: boolean;
  currentLanguagesToLearn: string[];
  refetch: (
    variables?: Partial<OperationVariables>
  ) => Promise<ApolloQueryResult<Query>>;
}

const AddOrRemoveLanguagesToLearnDialog: React.FC<
  AddOrRemoveLanguagesToLearnDialogProps
> = ({ open, currentLanguagesToLearn, refetch }) => {
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showRemoveLanguagesForm, setShowRemoveLanguagesForm] = useState(false);

  let router = useRouter();

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    successSnackbarOpen
      ? setSuccessSnackbarOpen(false)
      : setErrorSnackbarOpen(false);
  };

  const renderSnackbarMessage = () => {
    if (successSnackbarOpen) {
      return (
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          // Filled variant looks better in this case for the success color
          variant="filled"
          elevation={6}
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      );
    } else if (errorSnackbarOpen) {
      return (
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          elevation={6}
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      );
    }
  };

  return (
    <>
      <Dialog open={open} onClose={() => router.push("/exercises")} fullWidth>
        <DialogTitle textAlign="center">
          Add/Remove Languages
          <IconButton
            onClick={() => router.push("/exercises")}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        {showRemoveLanguagesForm ? (
          <RemoveLanguagesToLearnForm
            setShowRemoveLanguagesForm={setShowRemoveLanguagesForm}
            setSuccessMessage={setSuccessMessage}
            setErrorMessage={setErrorMessage}
            setSuccessSnackbarOpen={setSuccessSnackbarOpen}
            setErrorSnackbarOpen={setErrorSnackbarOpen}
            currentLanguagesToLearn={currentLanguagesToLearn}
            refetch={refetch}
          />
        ) : (
          <AddLanguagesToLearnForm
            setShowRemoveLanguagesForm={setShowRemoveLanguagesForm}
            setSuccessMessage={setSuccessMessage}
            setErrorMessage={setErrorMessage}
            setSuccessSnackbarOpen={setSuccessSnackbarOpen}
            setErrorSnackbarOpen={setErrorSnackbarOpen}
            refetch={refetch}
          />
        )}
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={successSnackbarOpen || errorSnackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        {renderSnackbarMessage()}
      </Snackbar>
    </>
  );
};

export default AddOrRemoveLanguagesToLearnDialog;
