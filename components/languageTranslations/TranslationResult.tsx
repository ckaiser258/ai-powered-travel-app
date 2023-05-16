import { Skeleton, Stack, Typography } from "@mui/material";

interface TranslationResultProps {
  textToTranslate: string;
  result: string;
  loading: boolean;
}

const TranslationResult: React.FC<TranslationResultProps> = ({
  textToTranslate,
  result,
  loading,
}) => {
  return (
    <Stack spacing={1} maxWidth={500} minWidth={300} textAlign="center">
      <Typography variant="h5">Original:</Typography>
      <Typography variant="body1">{textToTranslate}</Typography>
      <br />
      <Typography variant="h5">Translation:</Typography>
      <Typography variant="body1">
        {loading ? (
          <>
            <Skeleton width={300} animation="wave" />
            <Skeleton width={200} animation="wave" />
          </>
        ) : (
          result
        )}
      </Typography>
    </Stack>
  );
};

export default TranslationResult;
