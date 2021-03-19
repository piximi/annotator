import React from "react";
import { AnnotationModeTooltip } from "../AnnotationModeTooltip";

type AddTooltipProps = {
  children: React.ReactElement;
};

export const AddTooltip = ({ children }: AddTooltipProps) => {
  return (
    <AnnotationModeTooltip
      content={<p>Add area to the selected annotation.</p>}
    >
      {children}
    </AnnotationModeTooltip>
  );
};
