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
import Divider from "@material-ui/core/Divider";
import { InformationBox } from "../InformationBox";
import { useZoomOperator } from "../../../../hooks/useZoomOperator";

export const ZoomOptions = () => {
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

  const onZoomModeClick = (event: any, mode: ZoomMode) => {
    dispatch(
      slice.actions.setZoomMode({
        zoomMode: mode,
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

  const onActualSizeClick = () => {
    dispatch(
      slice.actions.setZoomReset({ zoomReset: !zoomSettings.zoomReset })
    );
  };

  const onFitToScreenClick = () => {};

  const t = useTranslation();

  return (
    <React.Fragment>
      <InformationBox description="…" name={t("Zoom")} />

      <Divider />

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
            <ListItem
              button
              dense
              onClick={(event) => onZoomModeClick(event, ZoomMode.In)}
            >
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

            <ListItem
              button
              dense
              onClick={(event) => onZoomModeClick(event, ZoomMode.Out)}
            >
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

      <Divider />

      <List component="nav" dense>
        <ListItem button onClick={onCenterChange}>
          <ListItemIcon>
            <Checkbox
              checked={zoomSettings.zoomAutomaticCentering}
              disableRipple
              edge="start"
              tabIndex={-1}
            />
          </ListItemIcon>

          <ListItemText
            primary={t("Auto-center")}
            secondary={t("Keep the image centered")}
          />
        </ListItem>
      </List>

      <Divider />

      <List dense>
        <ListItem button onClick={onActualSizeClick}>
          <ListItemText>{t("Actual size")}</ListItemText>
        </ListItem>

        <ListItem button onClick={onFitToScreenClick}>
          <ListItemText>{t("Fit to screen")}</ListItemText>
        </ListItem>
      </List>
    </React.Fragment>
  );
};
