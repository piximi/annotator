import React, { useEffect, useRef } from "react";
import { useStyles } from "./Main.css";
import { useBoundingClientRect } from "../../../../hooks/useBoundingClientRect";
import { Stage } from "../Stage";
import { useDispatch } from "react-redux";
import { setBoundingClientRect } from "../../../../store/slices";

export const Main = () => {
  const classes = useStyles();

  const ref = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const boundingClientRect = useBoundingClientRect(ref);

  useEffect(() => {
    if (!boundingClientRect) return;
    dispatch(setBoundingClientRect({ boundingClientRect: boundingClientRect }));
  }, [boundingClientRect]);

  return (
    <main className={classes.content} ref={ref}>
      <Stage />
    </main>
  );
};
