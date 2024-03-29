import Divider from "@material-ui/core/Divider";
import React from "react";
import { AnnotationMode } from "../AnnotationMode";
import { InformationBox } from "../InformationBox";
import { useTranslation } from "../../../../hooks/useTranslation";
import { InvertAnnotation } from "../InvertAnnotation";

export const EllipticalAnnotationOptions = () => {
  const t = useTranslation();
  return (
    <React.Fragment>
      <InformationBox
        description="Click and drag to create an elliptical annotation."
        name={t("Elliptical annotation")}
      />

      <Divider />

      <AnnotationMode />

      <Divider />

      <InvertAnnotation />
    </React.Fragment>
  );
};
