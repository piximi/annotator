import React from "react";
import { AnnotationModeTooltip } from "../AnnotationModeTooltip";
import Typography from "@material-ui/core/Typography";

type SubtractTooltipProps = {
  children: React.ReactElement;
};

export const SubtractTooltip = ({ children }: SubtractTooltipProps) => {
  const content = (
    <React.Fragment>
      <Typography variant="subtitle2" gutterBottom>
        Subtract from an existing annotation
      </Typography>

      <p>
        Subtracting an area removes the area you label from an existing
        annotation.
      </p>

      <p>TODO: add animated gif</p>

      <p>To subtract from an existing selection, do one of the following:</p>

      <ol>
        <li>Change the annotation mode to “Subtract area”</li>
        <li>Hold down the Option ⌥ key before starting to annotate.</li>
      </ol>
    </React.Fragment>
  );

  return (
    <AnnotationModeTooltip content={content}>{children}</AnnotationModeTooltip>
  );
};
