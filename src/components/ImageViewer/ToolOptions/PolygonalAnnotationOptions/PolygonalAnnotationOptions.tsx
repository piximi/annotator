import Divider from "@material-ui/core/Divider";
import React from "react";
import { AnnotationMode } from "../AnnotationMode";
import { InformationBox } from "../InformationBox";
import { InvertAnnotation } from "../InvertAnnotation";

export const PolygonalAnnotationOptions = () => {
  return (
    <React.Fragment>
      <InformationBox description="…" name="Polygonal annotation" />

      <Divider />

      <AnnotationMode />

      <Divider />

      <InvertAnnotation />
    </React.Fragment>
  );
};
