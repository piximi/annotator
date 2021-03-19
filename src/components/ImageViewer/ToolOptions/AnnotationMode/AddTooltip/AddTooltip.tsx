import React from "react";
import { AnnotationModeTooltip } from "../AnnotationModeTooltip";
import Typography from "@material-ui/core/Typography";

type AddTooltipProps = {
  children: React.ReactElement;
};

export const AddTooltip = ({ children }: AddTooltipProps) => {
  const content = (
    <React.Fragment>
      <Typography variant="subtitle2" gutterBottom>
        Add to an existing annotation
      </Typography>

      <p>
        Adding to an annotation adds any new areas you annotate to an existing
        annotation.
      </p>

      <p>TODO: add animated gif</p>

      <p>To add to an existing annotation, do one of the following:</p>

      <ol>
        <li>Change the annotation mode to "Add area"</li>
        <li>Hold down Shift before starting to annotate</li>
      </ol>
    </React.Fragment>
  );

  return (
    <AnnotationModeTooltip content={content}>{children}</AnnotationModeTooltip>
  );
};
