import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { invertModeSelector } from "../../../../store/selectors";
import { slice } from "../../../../store/slices";
import { useTranslation } from "../../../../hooks/useTranslation";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as InvertSelectionIcon } from "../../../icons/InvertAnnotation.svg";
import ListItemText from "@material-ui/core/ListItemText";

export const InvertAnnotation = () => {
  const dispatch = useDispatch();

  const invertMode = useSelector(invertModeSelector);

  const onInvertClick = () => {
    dispatch(slice.actions.setInvertMode({ invertMode: !invertMode }));
  };

  const t = useTranslation();

  return (
    <List>
      <ListItem button onClick={onInvertClick} dense>
        <ListItemIcon>
          <SvgIcon>
            <InvertSelectionIcon />
          </SvgIcon>
        </ListItemIcon>

        <ListItemText primary={t("Invert annotation")} />
      </ListItem>
    </List>
  );
};
