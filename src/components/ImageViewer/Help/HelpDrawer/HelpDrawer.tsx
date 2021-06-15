import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import CloseIcon from "@material-ui/icons/Close";

import { CollapsibleHelpContent } from "./CollapsibleHelpContent";
import { DialogContent, IconButton } from "@material-ui/core";
import { ColorAdjustmentIcon, HandIcon, ZoomIcon } from "../../../icons";
import Typography from "@material-ui/core/Typography";
import {
  ChangingAnnotationsHelpContent,
  MakingNewAnnotationsHelpContent,
  ManipulatingCanvasContent,
  OpeningImagesHelpContent,
  SavingProjectHelpContent,
} from "../HelpContent/HelpContent";
import { Box } from "mdi-material-ui";
import Container from "@material-ui/core/Container";
import { ChangingAnnotationsHelpDialog } from "../HelpDialog/ChangingAnnotationsHelpDialog";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

export default function HelpDrawer() {
  const useStyles = makeStyles((theme) => ({
    drawer: {
      width: "300px",
      flexShrink: 0,
    },
    drawerPaper: {
      width: "300px",
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

  // const list = (anchor: string) => (
  //   <div
  //     className={clsx(classes.list, {
  //       [classes.fullList]: anchor === "top" || anchor === "bottom",
  //     })}
  //     role="presentation"
  //     onClick={toggleDrawer(anchor, false)}
  //     onKeyDown={toggleDrawer(anchor, false)}
  //   >
  //     <List>
  //       {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
  //         <ListItem button key={text}>
  //           <ListItemIcon>
  //             {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
  //           </ListItemIcon>
  //           <ListItemText primary={text} />
  //         </ListItem>
  //       ))}
  //     </List>
  //     <Divider />
  //     <List>
  //       {["All mail", "Trash", "Spam"].map((text, index) => (
  //         <ListItem button key={text}>
  //           <ListItemIcon>
  //             {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
  //           </ListItemIcon>
  //           <ListItemText primary={text} />
  //         </ListItem>
  //       ))}
  //     </List>
  //   </div>
  // );

  return (
    <div>
      {
        <React.Fragment key={"left"}>
          <Button onClick={toggleDrawer("left", true)}>{"left"}</Button>
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
            <IconButton onClick={toggleDrawer("left", false)}>
              <CloseIcon />
            </IconButton>
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
