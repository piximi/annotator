import Radio from "@material-ui/core/Radio";
import React from "react";
import { RadioGroup } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useDispatch, useSelector } from "react-redux";
import { ZoomModeType } from "../../../../types/ZoomModeType";
import { setZoomToolOptions } from "../../../../store";
import Checkbox from "@material-ui/core/Checkbox";
import {
  zoomSettingsSelector,
  zoomToolOptionsSelector,
} from "../../../../store/selectors";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { RadioCheckedIcon, RadioUncheckedIcon } from "../../../icons";
import { useTranslation } from "../../../../hooks/useTranslation";
import Divider from "@material-ui/core/Divider";
import { InformationBox } from "../InformationBox";

export const ZoomOptions = () => {
  const dispatch = useDispatch();

  const zoomSettings = useSelector(zoomSettingsSelector);

  const options = useSelector(zoomToolOptionsSelector);

  const t = useTranslation();

  const onAutomaticCenteringChange = () => {
    const payload = {
      options: {
        ...options,
        automaticCentering: !options.automaticCentering,
      },
    };

    dispatch(setZoomToolOptions(payload));
  };

  const onToActualSizeClick = () => {
    const payload = {
      options: {
        ...options,
        toActualSize: !options.toActualSize,
      },
    };

    dispatch(setZoomToolOptions(payload));
  };

  const onToFitClick = () => {
    const payload = {
      options: {
        ...options,
        toFit: !options.toFit,
      },
    };

    dispatch(setZoomToolOptions(payload));
  };

  const onModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt((event.target as HTMLInputElement).value);

    const payload = {
      options: {
        ...options,
        mode: value as ZoomModeType,
      },
    };

    dispatch(setZoomToolOptions(payload));
  };

  const onModeClick = (event: any, mode: ZoomModeType) => {
    const payload = {
      options: {
        ...options,
        mode: mode,
      },
    };

    dispatch(setZoomToolOptions(payload));
  };

  return (
    <React.Fragment>
      <InformationBox description="…" name={t("Zoom")} />

      <Divider />

      <List dense>
        <RadioGroup
          defaultValue={ZoomModeType.In}
          aria-label="annotation mode"
          name="annotation-mode"
          onChange={onModeChange}
          value={options.mode}
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
              onClick={(event) => onModeClick(event, ZoomModeType.In)}
            >
              <ListItemIcon>
                <Radio
                  disableRipple
                  edge="start"
                  icon={<RadioUncheckedIcon />}
                  checkedIcon={<RadioCheckedIcon />}
                  tabIndex={-1}
                  value={ZoomModeType.In}
                />
              </ListItemIcon>

              <ListItemText primary={t("Zoom in")} />
            </ListItem>

            <ListItem
              button
              dense
              onClick={(event) => onModeClick(event, ZoomModeType.Out)}
            >
              <ListItemIcon>
                <Radio
                  disableRipple
                  edge="start"
                  icon={<RadioUncheckedIcon />}
                  checkedIcon={<RadioCheckedIcon />}
                  tabIndex={-1}
                  value={ZoomModeType.Out}
                />
              </ListItemIcon>

              <ListItemText primary={t("Zoom out")} />
            </ListItem>
          </List>
        </RadioGroup>
      </List>

      <Divider />

      <List component="nav" dense>
        <ListItem button onClick={onAutomaticCenteringChange}>
          <ListItemIcon>
            <Checkbox
              checked={zoomSettings.automaticCentering}
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
        <ListItem button onClick={onToActualSizeClick}>
          <ListItemText>{t("Actual size")}</ListItemText>
        </ListItem>

        <ListItem button onClick={onToFitClick}>
          <ListItemText>{t("Fit to screen")}</ListItemText>
        </ListItem>
      </List>
    </React.Fragment>
  );
};
