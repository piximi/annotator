import React, { useRef } from "react";
import { Stage } from "../Stage";
import { imageSelector } from "../../../../store/selectors";
import { useSelector } from "react-redux";
import { useStyles } from "./Content.css";
import { NativeTypes } from "react-dnd-html5-backend";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { useBoundingClientRect } from "../../../../hooks/useBoundingClientRect";
import { useCursor } from "../../../../hooks";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";

type ContentProps = {
  onDrop: (item: { files: any[] }) => void;
};

export const Content = ({ onDrop }: ContentProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const classes = useStyles();

  const image = useSelector(imageSelector);

  useBoundingClientRect(ref);

  const [, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item: { files: any[] }) {
        if (onDrop) {
          onDrop(item);
        }
      },
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    []
  );

  const { cursor } = useCursor();

  return (
    <React.Fragment>
      {/*<AppBar className={classes.appBar} color="default">*/}
      {/*  <Toolbar>*/}
      {/*    <Typography variant="h6" color="inherit">*/}
      {/*      &nbsp;*/}
      {/*    </Typography>*/}
      {/*  </Toolbar>*/}
      {/*</AppBar>*/}

      {/*<Divider />*/}

      <main className={classes.content} ref={ref} style={{ cursor: cursor }}>
        <Stage />
      </main>
    </React.Fragment>
  );
};
