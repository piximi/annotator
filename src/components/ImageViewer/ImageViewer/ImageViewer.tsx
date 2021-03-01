import React, { useEffect, useState } from "react";
import { Category } from "../../../types/Category";
import { CssBaseline } from "@material-ui/core";
import { Image } from "../../../types/Image";
import { ReactComponent as ColorAdjustmentIcon } from "../../icons/ColorAdjustment.svg";
import { ReactComponent as EllipticalIcon } from "../../icons/EllipticalSelection.svg";
import { ReactComponent as LassoIcon } from "../../icons/LassoSelection.svg";
import { ReactComponent as MagicWandIcon } from "../../icons/ColorSelection.svg";
import { ReactComponent as ZoomIcon } from "../../icons/Zoom.svg";
import { ReactComponent as HandIcon } from "../../icons/Hand.svg";
import { ReactComponent as MagneticIcon } from "../../icons/MagneticSelection.svg";
import { ReactComponent as QuickIcon } from "../../icons/QuickSelection.svg";
import { ReactComponent as ObjectSelectionIcon } from "../../icons/ObjectSelection.svg";
import { ReactComponent as PolygonalSelectionIcon } from "../../icons/PolygonalSelection.svg";
import { ReactComponent as RectangularIcon } from "../../icons/RectangularSelection.svg";
import { Operation } from "../../../types/Operation";
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
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { useStyles } from "./ImageViewer.css";
import { PenSelectionOptions } from "../OperationOptions/PenSelectionOptions";
import { PenSelection } from "../Content/Stage/Selection/PenSelection";
import { PenSelectionIcon } from "../../icons";

const theme = createMuiTheme({
  overrides: {
    MuiDrawer: {
      paperAnchorDockedLeft: {
        borderRight: "1px solid rgba(16, 16, 16)",
      },
      paperAnchorDockedRight: {
        borderLeft: "1px solid rgba(16, 16, 16)",
      },
    },
    MuiListItem: {
      root: {
        "&$selected": {
          backgroundColor: "rgba(60, 61, 62gi)",
        },
      },
    },
    MuiSlider: {
      rail: {
        color: "rgba(73, 73, 73)",
      },
      thumb: {
        color: "rgba(201, 201, 201)",
      },
      track: {
        color: "rgba(159, 159, 159)",
      },
    },
  },
  palette: {
    background: {
      paper: "rgba(40, 40, 40)",
      default: "rgba(50, 50, 50)",
    },
    divider: "rgba(72, 72, 72)",
    text: {
      primary: "rgba(190, 190, 190)",
    },
    type: "dark",
  },
});

type ImageViewerProps = {
  image?: Image;
};

export const ImageViewer = (props: ImageViewerProps) => {
  const handleRevertZoom = () => {
    setZoomReset(!zoomReset);
  };

  const [zoomReset, setZoomReset] = useState<boolean>(false);

  const operations = [
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <ColorAdjustmentIcon />,
      method: Operation.ColorAdjustment,
      name: "Color adjustment",
      options: <React.Fragment />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <RectangularIcon />,
      method: Operation.RectangularSelection,
      name: "Rectangular selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <EllipticalIcon />,
      method: Operation.EllipticalSelection,
      name: "Elliptical selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <PenSelectionIcon />,
      method: Operation.PenSelection,
      name: "Pen selection",
      options: <PenSelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <LassoIcon />,
      method: Operation.LassoSelection,
      name: "Lasso selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <PolygonalSelectionIcon />,
      method: Operation.PolygonalSelection,
      name: "Polygonal selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <MagneticIcon />,
      method: Operation.MagneticSelection,
      name: "Magnetic selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <MagicWandIcon />,
      method: Operation.ColorSelection,
      name: "Color selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <QuickIcon />,
      method: Operation.QuickSelection,
      name: "Quick selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <ObjectSelectionIcon />,
      method: Operation.ObjectSelection,
      name: "Object selection",
      options: <SelectionOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <HandIcon />,
      method: Operation.Hand,
      name: "Hand",
      options: <React.Fragment />,
    },
    {
      description: "Description of zoom here.",
      icon: <ZoomIcon />,
      method: Operation.Zoom,
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
          description={
            operations[
              operations.findIndex(
                (operation) => operation.method === activeOperation
              )
            ].description
          }
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

        <Operations />
      </div>
    </ThemeProvider>
  );
};
