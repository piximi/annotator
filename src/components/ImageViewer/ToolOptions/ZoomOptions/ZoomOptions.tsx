import Radio from "@material-ui/core/Radio";
import React from "react";
import { RadioGroup } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useDispatch, useSelector } from "react-redux";
import { ZoomMode } from "../../../../types/ZoomMode";
import { slice } from "../../../../store";
import Checkbox from "@material-ui/core/Checkbox";
import { zoomSettingsSelector } from "../../../../store/selectors";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { RadioCheckedIcon, RadioUncheckedIcon } from "../../../icons";
import { useTranslation } from "../../../../hooks/useTranslation";

type ZoomOptionsProps = {
  handleRevert: () => void;
};

export const ZoomOptions = ({ handleRevert }: ZoomOptionsProps) => {
  const dispatch = useDispatch();

  const zoomSettings = useSelector(zoomSettingsSelector);

  const onZoomModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt((event.target as HTMLInputElement).value);

    dispatch(
      slice.actions.setZoomMode({
        zoomMode: value as ZoomMode,
      })
    );
  };

  const onCenterChange = () => {
    dispatch(
      slice.actions.setZoomAutomaticCentering({
        zoomAutomaticCentering: !zoomSettings.zoomAutomaticCentering,
      })
    );
  };

  const t = useTranslation();

  return (
    <React.Fragment>
      <List dense>
        <RadioGroup
          defaultValue={ZoomMode.In}
          aria-label="annotation mode"
          name="annotation-mode"
          onChange={onZoomModeChange}
          value={zoomSettings.zoomMode}
        >
          <List
            component="nav"
            subheader={
              <ListSubheader component="div">{t("Zoom mode")}</ListSubheader>
            }
          >
            <ListItem button dense>
              <ListItemIcon>
                <Radio
                  disableRipple
                  edge="start"
                  icon={<RadioUncheckedIcon />}
                  checkedIcon={<RadioCheckedIcon />}
                  tabIndex={-1}
                  value={ZoomMode.In}
                />
              </ListItemIcon>

              <ListItemText primary={t("Zoom in")} />
            </ListItem>

            <ListItem button dense>
              <ListItemIcon>
                <Radio
                  disableRipple
                  edge="start"
                  icon={<RadioUncheckedIcon />}
                  checkedIcon={<RadioCheckedIcon />}
                  tabIndex={-1}
                  value={ZoomMode.Out}
                />
              </ListItemIcon>

              <ListItemText primary={t("Zoom out")} />
            </ListItem>
          </List>
        </RadioGroup>
      </List>

      <List component="nav">
        <ListItem button onClick={onCenterChange}>
          <ListItemIcon>
            <Checkbox
              checked={zoomSettings.zoomAutomaticCentering}
              disableRipple
              edge="start"
              tabIndex={-1}
            />
          </ListItemIcon>

          <ListItemText primary={t("Center image automatically")} />
        </ListItem>
      </List>

      <List>
        <ListItem button onClick={handleRevert}>
          <ListItemText>{t("Actual size")}</ListItemText>
        </ListItem>
      </List>
    </React.Fragment>
  );
};
