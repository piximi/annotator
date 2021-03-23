import Divider from "@material-ui/core/Divider";
import React from "react";
import { AnnotationMode } from "../AnnotationMode";
import { InformationBox } from "../InformationBox";
import { InvertAnnotation } from "../InvertAnnotation";

export const FreehandAnnotationOptions = () => {
  return (
    <React.Fragment>
      <InformationBox description="…" name="Freehand annotation" />

      <Divider />

      <AnnotationMode />

      <Divider />

      <InvertAnnotation />
    </React.Fragment>
  );
};
