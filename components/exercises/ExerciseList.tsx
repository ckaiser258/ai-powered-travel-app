import ExerciseForm from "./ExerciseForm";
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  Skeleton,
} from "@mui/material";

interface ExerciseListProps {
  exercises: any[];
  language: string;
  loading: boolean;
}

const SkeletonExerciseList = () => {
  const skeletonArray: JSX.Element[] = [];
  for (let i = 0; i < 10; i++) {
    skeletonArray.push(
      <Grid
        item
        xs={12}
        md={4}
        key={i}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Card
          sx={{
            width: 300,
            height: 200,
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-around",
            }}
          >
            <Typography variant="h5">
              <Skeleton width={250} animation="wave" />
              <Skeleton width={200} animation="wave" />
            </Typography>

            <Skeleton
              width={200}
              height={40}
              animation="wave"
              variant="rectangular"
            />
          </CardContent>
        </Card>
      </Grid>
    );
  }

  return <>{skeletonArray}</>;
};

const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  language,
  loading,
}) => {
  return (
    <Grid
      container
      flexDirection="row"
      justifyContent="center"
      spacing={2}
      mb={2}
    >
      {loading ? (
        <SkeletonExerciseList />
      ) : (
        exercises.map((exercise) => (
          <Grid
            item
            xs={12}
            md={4}
            key={exercise.id}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              sx={{
                width: 300,
                height: 200,
              }}
            >
              <CardContent>
                <Typography variant="h5">{exercise}</Typography>
              </CardContent>
              <CardActions>
                <ExerciseForm language={language} phrase={exercise} />
              </CardActions>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default ExerciseList;
