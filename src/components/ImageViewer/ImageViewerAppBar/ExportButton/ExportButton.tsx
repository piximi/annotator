import Button from "@material-ui/core/Button";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { useStyles } from "./ExportButton.css";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";
import { categoriesSelector, imageSelector } from "../../../../store/selectors";
import * as _ from "lodash";
import { useTranslation } from "../../../../hooks/useTranslation";
import { AnnotationType } from "../../../../types/AnnotationType";

export const ExportButton = () => {
  const classes = useStyles();

  const image = useSelector(imageSelector);
  const projectCategories = useSelector(categoriesSelector);

  const onClick = () => {
    if (!image) return;

    const content = {
      src: image.originalSrc,
      instances: image.annotations.map((instance: AnnotationType) => {
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

    const name =
      image.name.substr(0, image.name.lastIndexOf(".")) || image.name;

    saveAs(blob, `${name}.json`);
  };

  const t = useTranslation();

  return (
    <React.Fragment>
      <Tooltip title={t("Export annotations")}>
        <Button
          className={classes.button}
          startIcon={<CloudDownloadIcon />}
          onClick={onClick}
        >
          {t("Export")}
        </Button>
      </Tooltip>
    </React.Fragment>
  );
};
