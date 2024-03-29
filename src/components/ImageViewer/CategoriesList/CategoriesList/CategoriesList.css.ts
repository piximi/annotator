import { makeStyles } from "@material-ui/core/styles";
import texture from "../../../../images/texture.png";

export const useStyles = makeStyles((theme) => ({
  a: {
    color: "deepskyblue",
  },
  appBar: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    boxShadow: "none",
    position: "absolute",
  },
  drawer: {
    flexShrink: 0,
    width: theme.spacing(32),
  },
  iconButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  paper: {
    boxShadow: "inset 0 0 16px #000000",
    width: theme.spacing(32),
    zIndex: 0,
  },
  toolbar: {
    ...theme.mixins.toolbar,
    backgroundImage: `url(${texture})`,
  },
}));
