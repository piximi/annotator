import Divider from "@material-ui/core/Divider";
import React from "react";
import { SampleList } from "../SampleList";
import { AnnotationMode } from "../AnnotationMode";
import { InformationBox } from "../InformationBox";

export const ObjectAnnotationOptions = () => {
  return (
    <React.Fragment>
      <InformationBox description="…" name="Object annotation" />

      <Divider />

      <AnnotationMode />

      <Divider />

      <Divider />

      <SampleList />
    </React.Fragment>
  );
};
