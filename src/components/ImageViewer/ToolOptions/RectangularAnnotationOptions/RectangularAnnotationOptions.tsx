import Divider from "@material-ui/core/Divider";
import React from "react";
import { AnnotationMode } from "../AnnotationMode";
import { InformationBox } from "../InformationBox";
import { InvertAnnotation } from "../InvertAnnotation";

export const RectangularAnnotationOptions = () => {
  return (
    <React.Fragment>
      <InformationBox
        description="Click and drag to create a rectangular annotation."
        name="Rectangular annotation"
      />

      <Divider />

      <AnnotationMode />

      <Divider />

      <InvertAnnotation />
    </React.Fragment>
  );
};
