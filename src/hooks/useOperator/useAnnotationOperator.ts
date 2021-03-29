import { useEffect, useState } from "react";
import * as ImageJS from "image-js";
import { ToolType } from "../../types/ToolType";
import {
  ColorAnnotationTool,
  EllipticalAnnotationTool,
  LassoAnnotationTool,
  MagneticAnnotationTool,
  ObjectAnnotationTool,
  PenAnnotationTool,
  PolygonalAnnotationTool,
  QuickAnnotationTool,
  RectangularAnnotationTool,
  AnnotationTool,
} from "../../image/Tool";
import { useSelector } from "react-redux";
import { toolTypeSelector } from "../../store/selectors";
import { penSelectionBrushSizeSelector } from "../../store/selectors/penSelectionBrushSizeSelector";

export const useAnnotationOperator = (
  src: string,
  stagedImageShape: { width: number; height: number },
  zoomScale?: number
) => {
  const operation = useSelector(toolTypeSelector);

  const [operator, setOperator] = useState<AnnotationTool>();

  const [image, setImage] = useState<ImageJS.Image>();

  const brushSize = useSelector(penSelectionBrushSizeSelector);

  useEffect(() => {
    // // PUT HERE
    // const image = new Image();
    //
    // image.onload = () => {
    //     const width = image.naturalWidth;
    //     const height = image.naturalHeight;
    //
    //     const request = new Request(src);
    //
    //     fetch(request).then((response) => response.blob()).then((buffer) => {
    //         const foo = new ImageJS.Image(width, height, buffer)
    //         console.info(foo.toDataURL());
    //     })
    // };
    //
    // image.src = src;

    const loadImage = async () => {
      const image = await ImageJS.Image.load(src);
      setImage(image);
    };

    loadImage();
  }, [src]);

  useEffect(() => {
    if (!image) return;

    switch (operation) {
      case ToolType.ColorAnnotation:
        setOperator(new ColorAnnotationTool(image, stagedImageShape));

        return;
      case ToolType.EllipticalAnnotation:
        setOperator(new EllipticalAnnotationTool(image, stagedImageShape));

        return;
      case ToolType.LassoAnnotation:
        setOperator(new LassoAnnotationTool(image, stagedImageShape));

        return;
      case ToolType.MagneticAnnotation:
        setOperator(new MagneticAnnotationTool(image, 0.5, stagedImageShape));

        return;
      case ToolType.ObjectAnnotation:
        ObjectAnnotationTool.compile(image, stagedImageShape).then(
          (operator: ObjectAnnotationTool) => {
            setOperator(operator);
          }
        );

        return;
      case ToolType.PenAnnotation:
        const scale = zoomScale ? zoomScale : 1;
        PenAnnotationTool.setup(
          image,
          brushSize / scale,
          stagedImageShape
        ).then((operator: PenAnnotationTool) => {
          setOperator(operator);
        });

        return;
      case ToolType.PolygonalAnnotation:
        setOperator(new PolygonalAnnotationTool(image, stagedImageShape));

        return;
      case ToolType.QuickAnnotation:
        const quickSelectionOperator = QuickAnnotationTool.setup(
          image,
          stagedImageShape
        );
        setOperator(quickSelectionOperator);

        return;
      case ToolType.RectangularSelection:
        setOperator(new RectangularAnnotationTool(image, stagedImageShape));

        return;
    }
  }, [operation, image]);

  return [operator];
};
