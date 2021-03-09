import React, { useEffect, useState } from "react";
import { Category } from "../../../types/Category";
import { CssBaseline } from "@material-ui/core";
import { Image } from "../../../types/Image";
import { Tool } from "../../../types/Tool";
import {
  imageSelector,
  operationSelector,
  selectedCategroySelector,
  unknownCategroySelector,
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
  const handleRevertZoom = () => {
    setZoomReset(!zoomReset);
  };

  const [zoomReset, setZoomReset] = useState<boolean>(false);

  const { t, i18n } = useTranslation();

  const operations = [
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <ColorAdjustmentIcon />,
      method: Tool.ColorAdjustment,
      name: t("Color adjustment"),
      options: <React.Fragment />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <RectangularSelectionIcon />,
      method: Tool.RectangularSelection,
      name: "Rectangular selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <EllipticalSelectionIcon />,
      method: Tool.EllipticalAnnotation,
      name: "Elliptical selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <PenSelectionIcon />,
      method: Tool.PenAnnotation,
      name: "Pen selection",
      options: <PenSelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <LassoSelectionIcon />,
      method: Tool.LassoAnnotation,
      name: "Lasso selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <PolygonalSelectionIcon />,
      method: Tool.PolygonalAnnotation,
      name: "Polygonal selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <MagneticSelectionIcon />,
      method: Tool.MagneticAnnotation,
      name: "Magnetic selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <ColorSelectionIcon />,
      method: Tool.ColorAnnotation,
      name: "Color selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <QuickSelectionIcon />,
      method: Tool.QuickAnnotation,
      name: "Quick selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <ObjectSelectionIcon />,
      method: Tool.ObjectAnnotation,
      name: "Object selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <HandIcon />,
      method: Tool.Hand,
      name: "Hand",
      options: <React.Fragment />,
    },
    {
      description: "Description of zoom here.",
      icon: <ZoomIcon />,
      method: Tool.Zoom,
      name: "Zoom",
      options: <ZoomOptions handleRevert={handleRevertZoom} />,
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.image) {
      dispatch(slice.actions.setImage({ image: props.image }));
    }
  }, [dispatch, props.image]);

  const image = useSelector(imageSelector);

  const activeOperation = useSelector(operationSelector);

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

        <Collapse in={collapsed} timeout="auto" unmountOnExit>
          <OperationOptions
            handleCollapse={handleCollapse}
            name={
              operations[
                operations.findIndex(
                  (operation) => operation.method === activeOperation
                )
              ].name
            }
            settings={
              operations[
                operations.findIndex(
                  (operation) => operation.method === activeOperation
                )
              ].options
            }
          />
        </Collapse>

        <Operations handleCollapse={handleCollapse} />
      </div>
    </ThemeProvider>
  );
};
