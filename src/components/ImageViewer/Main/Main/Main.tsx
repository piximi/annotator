import React, { useRef } from "react";
import { useStyles } from "./Main.css";
import { useBoundingClientRect } from "../../../../hooks/useBoundingClientRect";
import { Stage } from "../Stage";

export const Main = () => {
  const ref = useRef<HTMLDivElement>(null);

  const boundingClientRect = useBoundingClientRect(ref);

  const classes = useStyles();

  return (
    <main className={classes.content} ref={ref}>
      <Stage boundingClientRect={boundingClientRect} />
    </main>
  );
};
