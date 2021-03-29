import React, { useCallback, useEffect, useState } from "react";
import { Category } from "../../../types/Category";
import { CssBaseline } from "@material-ui/core";
import { Image } from "../../../types/Image";
import { ToolType } from "../../../types/ToolType";
import {
  imageSelector,
  selectedCategroySelector,
  toolTypeSelector,
  unknownCategroySelector,
  zoomSettingsSelector,
} from "../../../store/selectors";
import { useDispatch, useSelector } from "react-redux";
import { ImageViewerAppBar } from "../ImageViewerAppBar";
import { Categories } from "../Categories";
import { ToolOptions } from "../ToolOptions";
import { Tools } from "../Tools";
import { ZoomOptions } from "../ToolOptions/ZoomOptions";
import { setImage, slice } from "../../../store";
import { Content } from "../Content";
import { ThemeProvider } from "@material-ui/core/styles";
import { useStyles } from "./ImageViewer.css";
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
import { useTranslation } from "react-i18next";
import { RectangularAnnotationOptions } from "../ToolOptions/RectangularAnnotationOptions";
import { EllipticalAnnotationOptions } from "../ToolOptions/EllipticalAnnotationOptions";
import { FreehandAnnotationOptions } from "../ToolOptions/FreehandAnnotationOptions";
import { LassoAnnotationOptions } from "../ToolOptions/LassoAnnotationOptions";
import { PolygonalAnnotationOptions } from "../ToolOptions/PolygonalAnnotationOptions";
import { MagneticAnnotationOptions } from "../ToolOptions/MagneticAnnotationOptions";
import { ColorAnnotationOptions } from "../ToolOptions/ColorAnnotationOptions";
import { QuickAnnotationOptions } from "../ToolOptions/QuickAnnotationOptions";
import { ObjectAnnotationOptions } from "../ToolOptions/ObjectAnnotationOptions";
import * as ImageJS from "image-js";
import { Shape } from "../../../types/Shape";

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
      options: <RectangularAnnotationOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <EllipticalSelectionIcon />,
      method: ToolType.EllipticalAnnotation,
      name: "Elliptical selection",
      options: <EllipticalAnnotationOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <PenSelectionIcon />,
      method: ToolType.PenAnnotation,
      name: "Pen selection",
      options: <FreehandAnnotationOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <LassoSelectionIcon />,
      method: ToolType.LassoAnnotation,
      name: "Lasso selection",
      options: <LassoAnnotationOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <PolygonalSelectionIcon />,
      method: ToolType.PolygonalAnnotation,
      name: "Polygonal selection",
      options: <PolygonalAnnotationOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <MagneticSelectionIcon />,
      method: ToolType.MagneticAnnotation,
      name: "Magnetic selection",
      options: <MagneticAnnotationOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <ColorSelectionIcon />,
      method: ToolType.ColorAnnotation,
      name: "Color selection",
      options: <ColorAnnotationOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <QuickSelectionIcon />,
      method: ToolType.QuickAnnotation,
      name: "Quick selection",
      options: <QuickAnnotationOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <ObjectSelectionIcon />,
      method: ToolType.ObjectAnnotation,
      name: "Object selection",
      options: <ObjectAnnotationOptions />,
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
    {
      description: "Description of pointer here.",
      icon: <ObjectSelectionIcon />,
      method: ToolType.Pointer,
      name: "Pointer",
      options: <React.Fragment />,
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

  const [dropped, setDropped] = useState<File[]>([]);

  const onDrop = useCallback(
    (item) => {
      if (item) {
        const file = item.files[0];

        const reader = new FileReader();

        reader.onload = async (event: ProgressEvent<FileReader>) => {};

        file.arrayBuffer().then((buffer: any) => {
          ImageJS.Image.load(buffer).then((image) => {
            const name = file.name;

            const shape: Shape = {
              r: image.height,
              c: image.width,
              channels: 4,
            };

            dispatch(
              setImage({
                image: {
                  id: "",
                  instances: [],
                  name: name,
                  shape: shape,
                  src: image.toDataURL(),
                },
              })
            );
          });
        });

        reader.readAsDataURL(file);
      }
    },
    [setDropped]
  );

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />

        <ImageViewerAppBar />

        <Categories onCategoryClick={onCategoryClick} />

        <Content category={activeCategory} onDrop={onDrop} />

        <ToolOptions
          settings={
            operations[
              operations.findIndex(
                (operation) => operation.method === activeOperation
              )
            ].options
          }
        />

        <Tools handleCollapse={handleCollapse} />
      </div>
    </ThemeProvider>
  );
};
