import React from "react";
import { AnnotationModeTooltip } from "../AnnotationModeTooltip";

type SubtractTooltipProps = {
  children: React.ReactElement;
};

export const SubtractTooltip = ({ children }: SubtractTooltipProps) => {
  return (
    <AnnotationModeTooltip
      content={<p>Subtract area from the selected annotation.</p>}
    >
      {children}
    </AnnotationModeTooltip>
  );
};
