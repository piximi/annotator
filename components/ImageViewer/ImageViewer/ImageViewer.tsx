import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Radio from "@material-ui/core/Radio";
import React, { useState } from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import Tooltip from "@material-ui/core/Tooltip";
import { Category } from "../../../types/Category";
import { CssBaseline } from "@material-ui/core";
import { EllipticalSelection } from "../EllipticalSelection";
import { Image } from "../../../types/Image";
import { LassoSelection } from "../LassoSelection/LassoSelection";
import { MagneticSelection } from "../MagneticSelection";
import { PolygonalSelection } from "../PolygonalSelection/PolygonalSelection";
import { ReactComponent as ColorAdjustmentIcon } from "../../../icons/ColorAdjustment.svg";
import { ReactComponent as EllipticalIcon } from "../../../icons/Elliptical.svg";
import { ReactComponent as InvertSelectionIcon } from "../../../icons/InvertSelection.svg";
import { ReactComponent as LassoIcon } from "../../../icons/Lasso.svg";
import { ReactComponent as MagicWandIcon } from "../../../icons/MagicWand.svg";
import { ReactComponent as ZoomIcon } from "../../../icons/Zoom.svg";
import { ReactComponent as HandIcon } from "../../../icons/Hand.svg";
import { ReactComponent as MagneticIcon } from "../../../icons/Magnetic.svg";
import { ReactComponent as QuickIcon } from "../../../icons/Quick.svg";
import { ReactComponent as ObjectSelectionIcon } from "../../../icons/ObjectSelection.svg";
import { ReactComponent as RectangularIcon } from "../../../icons/Rectangular.svg";
import { RectangularSelection } from "../RectangularSelection";
import { ImageViewerOperation } from "../../../types/ImageViewerOperation";
import { ObjectSelection } from "../ObjectSelection";
import { SelectionType } from "../../../types/SelectionType";
import {
  imagesSelector,
  unknownCategorySelector,
} from "../../../store/selectors";
import { useDispatch, useSelector } from "react-redux";
import { useStyles } from "./ImageViewer.css";
import { projectSlice } from "../../../store/slices";
import { QuickSelection } from "../QuickSelection";
import { ImageViewerAppBar } from "../ImageViewerAppBar";
import { CategoriesDrawer } from "../CategoriesDrawer";
import { OperationOptionsDrawer } from "../OperationOptionsDrawer";

type ImageViewerStageProps = {
  operation: ImageViewerOperation;
  data: Image;
  category: Category;
};

const ImageViewerStage = ({
  operation,
  data,
  category,
}: ImageViewerStageProps) => {
  if (data && data.shape && data.src) {
    switch (operation) {
      case ImageViewerOperation.ColorSelection:
        return <React.Fragment />;
      case ImageViewerOperation.EllipticalSelection:
        return <EllipticalSelection data={data} category={category} />;
      case ImageViewerOperation.LassoSelection:
        return <LassoSelection image={data} category={category} />;
      case ImageViewerOperation.MagneticSelection:
        return <MagneticSelection image={data} />;
      case ImageViewerOperation.ObjectSelection:
        return <ObjectSelection data={data} category={category} />;
      case ImageViewerOperation.PolygonalSelection:
        return <PolygonalSelection image={data} category={category} />;
      case ImageViewerOperation.QuickSelection:
        return <QuickSelection image={data} category={category} />;
      case ImageViewerOperation.RectangularSelection:
        return <RectangularSelection data={data} category={category} />;
      default:
        return <React.Fragment />;
    }
  } else {
    return <React.Fragment />;
  }
};

const SelectionSettings = () => {
  return (
    <React.Fragment>
      <List>
        <ListItem dense disabled>
          <ListItemIcon>
            <Radio disableRipple disabled edge="start" tabIndex={-1} />
          </ListItemIcon>

          <ListItemText
            primary={SelectionType.New}
            secondary="Create a new selection."
          />
        </ListItem>

        <ListItem dense disabled>
          <ListItemIcon>
            <Radio disableRipple disabled edge="start" tabIndex={-1} />
          </ListItemIcon>

          <ListItemText
            primary={SelectionType.Addition}
            secondary="Add area to the existing selection."
          />
        </ListItem>

        <ListItem dense disabled>
          <ListItemIcon>
            <Radio disableRipple disabled edge="start" tabIndex={-1} />
          </ListItemIcon>

          <ListItemText
            primary={SelectionType.Subtraction}
            secondary="Subtract area from the existing selection."
          />
        </ListItem>

        <ListItem dense disabled>
          <ListItemIcon>
            <Radio disableRipple disabled edge="start" tabIndex={-1} />
          </ListItemIcon>

          <ListItemText
            primary={SelectionType.Intersection}
            secondary="Constrain the boundary of the new selection to the existing selection."
          />
        </ListItem>
      </List>

      <Divider />

      <List>
        <ListItem button dense>
          <ListItemIcon>
            <SvgIcon>
              <InvertSelectionIcon />
            </SvgIcon>
          </ListItemIcon>

          <ListItemText primary="Invert selection" />
        </ListItem>
      </List>
    </React.Fragment>
  );
};

type ImageViewerProps = {
  foo: Image;
};

export const ImageViewer = ({ foo }: ImageViewerProps) => {
  const operations = [
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <ColorAdjustmentIcon />,
      method: ImageViewerOperation.ColorAdjustment,
      name: "Color adjustment",
      settings: <React.Fragment />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <RectangularIcon />,
      method: ImageViewerOperation.RectangularSelection,
      name: "Rectangular selection",
      settings: <SelectionSettings />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <EllipticalIcon />,
      method: ImageViewerOperation.EllipticalSelection,
      name: "Elliptical selection",
      settings: <SelectionSettings />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <EllipticalIcon />,
      method: ImageViewerOperation.PolygonalSelection,
      name: "Polygonal selection",
      settings: <SelectionSettings />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <LassoIcon />,
      method: ImageViewerOperation.LassoSelection,
      name: "Lasso selection",
      settings: <SelectionSettings />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <MagneticIcon />,
      method: ImageViewerOperation.MagneticSelection,
      name: "Magnetic selection",
      settings: <SelectionSettings />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <MagicWandIcon />,
      method: ImageViewerOperation.ColorSelection,
      name: "Color selection",
      settings: <SelectionSettings />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <QuickIcon />,
      method: ImageViewerOperation.QuickSelection,
      name: "Quick selection",
      settings: <SelectionSettings />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <ObjectSelectionIcon />,
      method: ImageViewerOperation.ObjectSelection,
      name: "Object selection",
      settings: <SelectionSettings />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <HandIcon />,
      method: ImageViewerOperation.Hand,
      name: "Hand",
      settings: <React.Fragment />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <ZoomIcon />,
      method: ImageViewerOperation.Zoom,
      name: "Zoom",
      settings: <React.Fragment />,
    },
  ];

  const dispatch = useDispatch();

  // TODO: Testing code, please remove ASAP
  React.useEffect(() => {
    const payload = { shape: foo.shape!, src: foo.src };

    dispatch(projectSlice.actions.createImage(payload));
  }, [foo, dispatch]);

  const images = useSelector(imagesSelector);

  const [activeOperation, setActiveOperation] = useState<ImageViewerOperation>(
    ImageViewerOperation.RectangularSelection
  );

  const classes = useStyles();

  const unknownCategory = useSelector(unknownCategorySelector);

  const [activeCategory, setActiveCategory] = useState<Category>(
    unknownCategory
  );

  const onCategoryClick = (
    event: React.MouseEvent<HTMLDivElement>,
    category: Category
  ) => {
    setActiveCategory(category);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />

      <ImageViewerAppBar />

      <CategoriesDrawer
        activeCategory={activeCategory}
        onCategoryClick={onCategoryClick}
      />

      <main className={classes.content}>
        <div className={classes.toolbar} />

        <Box alignItems="center" display="flex" justifyContent="center">
          <ImageViewerStage
            operation={activeOperation}
            data={images[0]}
            category={activeCategory}
          />
        </Box>
      </main>

      <OperationOptionsDrawer
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
          ].settings
        }
      />

      <Drawer
        anchor="right"
        className={classes.operations}
        classes={{ paper: classes.operationsPaper }}
        variant="permanent"
      >
        <div className={classes.operationsToolbar} />

        <Divider />

        <List>
          {operations.map((operation, index) => {
            return (
              <React.Fragment>
                <Tooltip
                  aria-label={operation.name}
                  key={index}
                  title={operation.name}
                >
                  <ListItem
                    button
                    disabled={[
                      ImageViewerOperation.ColorAdjustment,
                      ImageViewerOperation.ColorSelection,
                      ImageViewerOperation.Hand,
                      ImageViewerOperation.QuickSelection,
                      ImageViewerOperation.Zoom,
                    ].includes(operation.method)}
                    onClick={() => setActiveOperation(operation.method)}
                    selected={activeOperation === operation.method}
                  >
                    <ListItemIcon>
                      <SvgIcon fontSize="small">{operation.icon}</SvgIcon>
                    </ListItemIcon>
                  </ListItem>
                </Tooltip>

                {(operation.method === ImageViewerOperation.ObjectSelection ||
                  operation.method ===
                    ImageViewerOperation.ColorAdjustment) && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      </Drawer>
    </div>
  );
};
