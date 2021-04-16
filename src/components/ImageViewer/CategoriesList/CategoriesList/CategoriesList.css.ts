import { makeStyles } from "@material-ui/core/styles";
import texture from "../../../../images/texture.png";

const settingsWidth = 240;
const operationsWidth = 56;

export const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    boxShadow: "none",
    position: "absolute",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appBarShiftLeft: {
    marginLeft: 240,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: "none",
  },
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    width: "100%",
  },
  settings: {
    width: settingsWidth,
    flexShrink: 0,
  },
  settingsPaper: {
    width: settingsWidth,
    right: operationsWidth,
  },
  toolbar: {
    ...theme.mixins.toolbar,
  },
  settingsToolbar: {
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  operations: {
    flexShrink: 0,
    whiteSpace: "nowrap",
    width: operationsWidth,
  },
  operationsPaper: {
    width: operationsWidth,
  },
  operationsToolbar: {
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  logo: {
    flexGrow: 1,
  },
  applicationDrawer: {
    flexShrink: 0,
    width: theme.spacing(32),
  },
  applicationDrawerHeader: {
    ...theme.mixins.toolbar,
    alignItems: "center",
    display: "flex",
    paddingLeft: theme.spacing(3),
  },
  applicationDrawerPaper: {
    zIndex: 0,
    width: theme.spacing(32),
    backgroundImage: `url(${texture})`,
  },
}));
