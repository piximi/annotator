import Divider from "@material-ui/core/Divider";
import React from "react";
import { AnnotationMode } from "../AnnotationMode";
import { InformationBox } from "../InformationBox";
import { InvertAnnotation } from "../InvertAnnotation";
import { useTranslation } from "../../../../hooks/useTranslation";

export const RectangularAnnotationOptions = () => {
  const t = useTranslation();
  return (
    <React.Fragment>
      <InformationBox
        description="Click and drag to create a rectangular annotation."
        name={t("Rectangular annotation")}
      />

      <Divider />

      <AnnotationMode />

      <Divider />

      <InvertAnnotation />
    </React.Fragment>
  );
};
