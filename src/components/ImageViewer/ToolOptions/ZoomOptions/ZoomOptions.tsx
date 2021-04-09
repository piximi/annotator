import Radio from "@material-ui/core/Radio";
import React, { useEffect } from "react";
import { RadioGroup } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useDispatch, useSelector } from "react-redux";
import { ZoomModeType } from "../../../../types/ZoomModeType";
import {
  setOffset,
  setZoomToolOptions,
  setStageScale,
} from "../../../../store";
import Checkbox from "@material-ui/core/Checkbox";
import {
  imageSelector,
  stageScaleSelector,
  stageWidthSelector,
  zoomToolOptionsSelector,
} from "../../../../store/selectors";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { RadioCheckedIcon, RadioUncheckedIcon } from "../../../icons";
import { useTranslation } from "../../../../hooks/useTranslation";
import Divider from "@material-ui/core/Divider";
import { InformationBox } from "../InformationBox";
import Slider from "@material-ui/core/Slider";
import * as _ from "lodash";
import Grid from "@material-ui/core/Grid";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import { offsetSelector } from "../../../../store/selectors/offsetSelector";

export const ZoomOptions = () => {
  const dispatch = useDispatch();

  const options = useSelector(zoomToolOptionsSelector);

  const stageWidth = useSelector(stageWidthSelector);

  const t = useTranslation();

  const scale = useSelector(stageScaleSelector);
  const image = useSelector(imageSelector);
  const offset = useSelector(offsetSelector);

  const onAutomaticCenteringChange = () => {
    const payload = {
      options: {
        ...options,
        automaticCentering: !options.automaticCentering,
      },
    };

    dispatch(setZoomToolOptions(payload));

    const centerOffset = {
      x: offset.x !== 0 ? 0 : (1600 * scale) / 2 - offset.x,
      y: offset.y !== 0 ? 0 : (1200 * scale) / 2 - offset.y,
    }; //FIXME hardcoded heights and widths before merging with master branch!;

    dispatch(setOffset({ offset: centerOffset }));
  };

  const onToActualSizeClick = () => {
    const payload = {
      options: {
        ...options,
        automaticCentering: true,
        toActualSize: !options.toActualSize,
      },
    };

    dispatch(setZoomToolOptions(payload));
    dispatch(setStageScale({ stageScale: 1 }));
    dispatch(setOffset({ offset: { x: 0, y: 0 } }));
  };

  const onToFitClick = () => {
    const payload = {
      options: {
        ...options,
        automaticCentering: true,
        toFit: !options.toFit,
      },
    };

    if (!image || !image.shape) return;

    dispatch(setZoomToolOptions(payload));
    //FIXME: image.shape.width is not updated in current setup in Main.tsx
    //dispatch(setStageScale({stageScale: stageWidth / (image.shape.width) }))
    dispatch(setStageScale({ stageScale: stageWidth / 1600 }));
    dispatch(setOffset({ offset: { x: 0, y: 0 } }));
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

  const marks = [
    {
      value: 0.000625,
      label: "-1600%",
    },
    {
      value: 0.00125,
      label: "-800%",
    },
    {
      value: 0.0025,
      label: "-400%",
    },
    {
      value: 0.005,
      label: "-200%",
    },
    {
      value: 0.05,
      label: "-150%",
    },
    {
      value: 0.25,
      label: "-100%",
    },
    {
      value: 0.5,
      label: "50%",
    },
    {
      value: 1,
      label: "100%",
    },
    {
      value: 1.5,
      label: "150%",
    },
    {
      value: 2,
      label: "200%",
    },
    {
      value: 4,
      label: "400%",
    },
    {
      value: 8,
      label: "800%",
    },
    {
      value: 16,
      label: "1600%",
    },
  ];

  const valueLabelFormat = (value: number) => {
    if (value < 0 || value >= marks.length) return;

    return marks[value].label;
  };

  const onSliderChange = (value: number) => {
    dispatch(setStageScale({ stageScale: value }));
  };

  return (
    <React.Fragment>
      <InformationBox description="…" name={t("Zoom")} />

      <Divider />

      <List
        component="nav"
        subheader={
          <ListSubheader component="div">{t("Zoom scale")}</ListSubheader>
        }
      >
        <ListItem>
          <Grid container spacing={2}>
            <Grid item>
              <ZoomOutIcon />
            </Grid>
            <Grid item xs>
              <Slider
                defaultValue={1}
                onChange={(event: any, value: number | number[]) =>
                  onSliderChange(value as number)
                }
                valueLabelDisplay="auto"
                value={scale}
                min={Number.EPSILON}
                max={10}
                step={0.01}
              />
            </Grid>
            <Grid item>
              <ZoomInIcon />
            </Grid>
          </Grid>
        </ListItem>
      </List>

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
              checked={options.automaticCentering}
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
