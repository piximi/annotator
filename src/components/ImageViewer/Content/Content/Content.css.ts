import { makeStyles } from "@material-ui/core/styles";

const toolOptionsDrawerWidth = 50;

export const useStyles = makeStyles((theme) => ({
  content: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    width: "100%",
  },
  stage: {
    margin: "8px",
  },
  toolbar: {
    ...theme.mixins.toolbar,
  },
  parent: {
    cursor: "crosshair",
    // width: "100%",
    width: `calc(100% - ${toolOptionsDrawerWidth}px)`,
  },
}));
