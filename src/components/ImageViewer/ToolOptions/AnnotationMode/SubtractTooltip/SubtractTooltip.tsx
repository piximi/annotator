import React from "react";
import { AnnotationModeTooltip } from "../AnnotationModeTooltip";

type SubtractTooltipProps = {
  children: React.ReactElement;
};

export const SubtractTooltip = ({ children }: SubtractTooltipProps) => {
  const content = (
    <React.Fragment>
      <p>
        Subtracting an area removes the area you label from an existing
        annotation (Press alt/option on your keyboard to trigger this mode).
      </p>
    </React.Fragment>
  );

  return (
    <AnnotationModeTooltip content={content}>{children}</AnnotationModeTooltip>
  );
};
