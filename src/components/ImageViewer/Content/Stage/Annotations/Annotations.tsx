import React from "react";
import { UnselectedAnnotations } from "./UnselectedAnnotations";
import { SelectedAnnotations } from "./SelectedAnnotations/SelectedAnnotations";

export const Annotations = () => {
  return (
    <React.Fragment>
      <SelectedAnnotations />
      <UnselectedAnnotations />
    </React.Fragment>
  );
};
