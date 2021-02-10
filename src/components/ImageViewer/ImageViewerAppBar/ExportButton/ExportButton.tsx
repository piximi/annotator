import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { useStyles } from "./ExportButton.css";
import { saveAs } from "file-saver";

export const ExportButton = () => {
  const classes = useStyles();

  const onClick = () => {
    const blob = new Blob(["{ foo: true }"], {
      type: "text/json;charset=utf-8",
    });

    saveAs(blob, "foo.json");
  };

  return (
    <React.Fragment>
      <Tooltip title="Export annotations">
        <Button
          className={classes.button}
          startIcon={<CloudUploadIcon />}
          onClick={onClick}
        >
          Export
        </Button>
      </Tooltip>
    </React.Fragment>
  );
};
