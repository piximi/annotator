import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as InvertSelectionIcon } from "../../../icons/InvertAnnotation.svg";
import { useDispatch, useSelector } from "react-redux";
import { invertModeSelector } from "../../../../store/selectors";
import { slice } from "../../../../store";
import { AnnotationMode } from "../AnnotationMode";
import { InformationBox } from "../InformationBox";
import { useTranslation } from "../../../../hooks/useTranslation";
import { InvertAnnotation } from "../InvertAnnotation";

export const EllipticalAnnotationOptions = () => {
  return (
    <React.Fragment>
      <InformationBox
        description="Click and drag to create an elliptical annotation."
        name="Elliptical annotation"
      />

      <Divider />

      <AnnotationMode />

      <Divider />

      <InvertAnnotation />
    </React.Fragment>
  );
};
