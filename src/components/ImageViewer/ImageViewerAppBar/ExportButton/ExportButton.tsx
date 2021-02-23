import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { useStyles } from "./ExportButton.css";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";
import {
  categoriesSelector,
  imageViewerImageSelector,
} from "../../../../store/selectors";
import * as _ from "lodash";

export const ExportButton = () => {
  const classes = useStyles();

  const image = useSelector(imageViewerImageSelector);
  const projectCategories = useSelector(categoriesSelector);

  const onClick = () => {
    if (!image) return;

    const content = {
      src: image.src,
      instances: image.instances.map((instance) => {
        return {
          boundingBox: instance.boundingBox,
          category: _.find(projectCategories, (category) => {
            return category.id === instance.categoryId;
          })?.name,
          mask: instance.mask,
        };
      }),
    };

    const blobParts = [JSON.stringify(content)];

    const options = {
      type: "text/json;charset=utf-8",
    };

    const blob = new Blob(blobParts, options);

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
