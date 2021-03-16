import React, { useEffect, useState } from "react";
import { Category } from "../../../types/Category";
import { CssBaseline } from "@material-ui/core";
import { Image } from "../../../types/Image";
import { ToolType } from "../../../types/ToolType";
import {
  imageSelector,
  toolTypeSelector,
  selectedCategroySelector,
  unknownCategroySelector,
  zoomSettingsSelector,
} from "../../../store/selectors";
import { useDispatch, useSelector } from "react-redux";
import { ImageViewerAppBar } from "../ImageViewerAppBar";
import { Categories } from "../Categories";
import { OperationOptions } from "../OperationOptions";
import { SelectionOptions } from "../OperationOptions/SelectionOptions";
import { Operations } from "../Operations";
import { ZoomOptions } from "../OperationOptions/ZoomOptions";
import { slice } from "../../../store/slices";
import { Content } from "../Content";
import { ThemeProvider } from "@material-ui/core/styles";
import { useStyles } from "./ImageViewer.css";
import { PenSelectionOptions } from "../OperationOptions/PenSelectionOptions";
import {
  ColorAdjustmentIcon,
  ColorSelectionIcon,
  EllipticalSelectionIcon,
  HandIcon,
  LassoSelectionIcon,
  MagneticSelectionIcon,
  ObjectSelectionIcon,
  PenSelectionIcon,
  PolygonalSelectionIcon,
  QuickSelectionIcon,
  RectangularSelectionIcon,
  ZoomIcon,
} from "../../icons";
import { theme } from "./theme";
import Collapse from "@material-ui/core/Collapse";
import { useTranslation } from "react-i18next";

type ImageViewerProps = {
  image?: Image;
};

export const ImageViewer = (props: ImageViewerProps) => {
  const dispatch = useDispatch();

  const zoomSettings = useSelector(zoomSettingsSelector);

  const handleZoomReset = () => {
    dispatch(
      slice.actions.setZoomReset({ zoomReset: !zoomSettings.zoomReset })
    );
  };

  const { t, i18n } = useTranslation();

  const operations = [
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <ColorAdjustmentIcon />,
      method: ToolType.ColorAdjustment,
      name: t("Color adjustment"),
      options: <React.Fragment />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <RectangularSelectionIcon />,
      method: ToolType.RectangularSelection,
      name: "Rectangular selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <EllipticalSelectionIcon />,
      method: ToolType.EllipticalAnnotation,
      name: "Elliptical selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <PenSelectionIcon />,
      method: ToolType.PenAnnotation,
      name: "Pen selection",
      options: <PenSelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <LassoSelectionIcon />,
      method: ToolType.LassoAnnotation,
      name: "Lasso selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <PolygonalSelectionIcon />,
      method: ToolType.PolygonalAnnotation,
      name: "Polygonal selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <MagneticSelectionIcon />,
      method: ToolType.MagneticAnnotation,
      name: "Magnetic selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <ColorSelectionIcon />,
      method: ToolType.ColorAnnotation,
      name: "Color selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <QuickSelectionIcon />,
      method: ToolType.QuickAnnotation,
      name: "Quick selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <ObjectSelectionIcon />,
      method: ToolType.ObjectAnnotation,
      name: "Object selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <HandIcon />,
      method: ToolType.Hand,
      name: "Hand",
      options: <React.Fragment />,
    },
    {
      description: "Description of zoom here.",
      icon: <ZoomIcon />,
      method: ToolType.Zoom,
      name: "Zoom",
      options: <ZoomOptions handleRevert={handleZoomReset} />,
    },
  ];

  useEffect(() => {
    if (props.image) {
      dispatch(slice.actions.setImage({ image: props.image }));
    }
  }, [dispatch, props.image]);

  const image = useSelector(imageSelector);

  const activeOperation = useSelector(toolTypeSelector);

  const classes = useStyles();

  const unknownCategory = useSelector(unknownCategroySelector);

  const activeCategory = useSelector(selectedCategroySelector);

  const onCategoryClick = (
    event: React.MouseEvent<HTMLDivElement>,
    category: Category
  ) => {
    dispatch(
      slice.actions.setSeletedCategory({
        selectedCategory: category.id,
      })
    );
  };

  const [collapsed, setCollapsed] = React.useState(false);

  const handleCollapse = (isCollapsed: boolean) => {
    setCollapsed(isCollapsed);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />

        <ImageViewerAppBar />

        <Categories
          activeCategory={activeCategory}
          onCategoryClick={onCategoryClick}
        />

        {image && <Content category={activeCategory} />}

        <OperationOptions
          settings={
            operations[
              operations.findIndex(
                (operation) => operation.method === activeOperation
              )
            ].options
          }
        />

        <Operations handleCollapse={handleCollapse} />
      </div>
    </ThemeProvider>
  );
};
