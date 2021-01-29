import * as ReactKonva from "react-konva";
import React, { useRef } from "react";
import useImage from "use-image";
import { Stage } from "konva/types/Stage";
import { useSelector } from "react-redux";
import { useStyles } from "./Content.css";
import { imageViewerImageSelector } from "../../store/selectors";
import Konva from "konva";

export const Content = () => {
  const image = useSelector(imageViewerImageSelector);

  const [img] = useImage(image!.src, "Anonymous");
  const classes = useStyles();
  const stageRef = useRef<Stage>(null);
  const imageRef = useRef<Konva.Image>(null);

  const onMouseDown = () => {};
  const onMouseMove = () => {};
  const onMouseUp = () => {};

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />

      <div className={classes.parent}>
        <ReactKonva.Stage
          className={classes.stage}
          globalCompositeOperation="destination-over"
          height={512}
          ref={stageRef}
          width={512}
        >
          <ReactKonva.Layer
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
          >
            {img && <ReactKonva.Image ref={imageRef} image={img} />}
          </ReactKonva.Layer>
        </ReactKonva.Stage>
      </div>
    </main>
  );
};
