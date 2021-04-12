import React, { useRef } from "react";
import { useStyles } from "./Main.css";
import { Stage } from "../Stage";

export const Main = () => {
  const classes = useStyles();

  const ref = useRef<HTMLDivElement>(null);

  return (
    <main className={classes.content} ref={ref}>
      <Stage />
    </main>
  );
};
