import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CloseIcon from "@material-ui/icons/Close";

import { CollapsibleHelpContent } from "./CollapsibleHelpContent";
import { IconButton } from "@material-ui/core";
import {
  ChangingAnnotationsHelpContent,
  CreatingCategoriesContent,
  MakingNewAnnotationsHelpContent,
  ManipulatingCanvasContent,
  OpeningImagesHelpContent,
  SavingProjectHelpContent,
} from "../HelpContent/HelpContent";
import Container from "@material-ui/core/Container";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import HelpIcon from "@material-ui/icons/Help";
import ListItemText from "@material-ui/core/ListItemText";

export default function HelpDrawer() {
  const useStyles = makeStyles((theme) => ({
    drawer: {
      width: theme.spacing(35),
      flexShrink: 0,
    },
    drawerPaper: {
      width: theme.spacing(35),
    },
  }));

  const classes = useStyles();

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor: string, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <div>
      {
        <React.Fragment key={"left"}>
          <ListItem button onClick={toggleDrawer("left", true)}>
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>

            <ListItemText primary="Help" />
          </ListItem>
          <Drawer
            variant={"persistent"}
            anchor={"left"}
            className={classes.drawer}
            classes={{
              paper: classes.drawerPaper,
            }}
            open={state["left"]}
            onClose={toggleDrawer("left", false)}
          >
            <div tabIndex={1} role="button">
              <IconButton
                style={{ float: "right", marginRight: "20px" }}
                onClick={toggleDrawer("left", false)}
              >
                <CloseIcon />
              </IconButton>
            </div>
            <CollapsibleHelpContent
              primary={"Opening images"}
              closed={false}
              dense={true}
            >
              <Container>
                <OpeningImagesHelpContent />
              </Container>
            </CollapsibleHelpContent>
            <CollapsibleHelpContent
              primary={"Manipulating the canvas"}
              closed={false}
              dense={true}
            >
              <Container>
                <ManipulatingCanvasContent />
              </Container>
            </CollapsibleHelpContent>
            <CollapsibleHelpContent
              primary={"Creating categories"}
              closed={false}
              dense={true}
            >
              <Container>
                <CreatingCategoriesContent />
              </Container>
            </CollapsibleHelpContent>
            <CollapsibleHelpContent
              primary={"Making new annotations"}
              closed={false}
              dense={true}
            >
              <Container>
                <MakingNewAnnotationsHelpContent />
              </Container>
            </CollapsibleHelpContent>
            <CollapsibleHelpContent
              primary={"Changing existing annotations"}
              closed={false}
              dense={true}
            >
              <Container>
                <ChangingAnnotationsHelpContent />
              </Container>
            </CollapsibleHelpContent>
            <CollapsibleHelpContent
              primary={"Saving project and exporting annotations"}
              closed={false}
              dense={true}
            >
              <Container>
                <SavingProjectHelpContent />
              </Container>
            </CollapsibleHelpContent>
          </Drawer>
        </React.Fragment>
      }
    </div>
  );
}
