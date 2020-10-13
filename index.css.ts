import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp,
    }),
  },
  appBarShift: {
    marginLeft: theme.spacing(30),
    transition: theme.transitions.create(["margin", "width"], {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.easeOut,
    }),
    width: `calc(100% - ${theme.spacing(30)}px)`,
  },
  card: {},
  container: {
    paddingBottom: theme.spacing(8),
    paddingTop: theme.spacing(8),
  },
  drawer: {
    flexShrink: 0,
    width: theme.spacing(30),
  },
  drawerHeader: {
    ...theme.mixins.toolbar,
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
  },
  drawerPaper: {
    width: theme.spacing(30),
  },
  gridList: {
    transform: "translateZ(0)",
  },
  gridTileBar: {
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)",
  },
  gridTileBarIconButton: {
    color: "white",
  },
  main: {
    flexGrow: 1,
    marginLeft: -theme.spacing(30),
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp,
    }),
  },
  mainShift: {
    marginLeft: 0,
    transition: theme.transitions.create("margin", {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.easeOut,
    }),
  },
  media: {},
  settingsDialogAppBar: {},
}));
