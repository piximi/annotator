import { makeStyles } from "@material-ui/core/styles";

const toolOptionsDrawerWidth = 50;

export const useStyles = makeStyles((theme) => ({
  content: {
    backgroundColor: theme.palette.background.default,
    width: "100%",
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
