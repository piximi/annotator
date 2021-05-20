import * as _ from "lodash";
import * as ImageJS from "image-js";
import { AnnotationType } from "../types/AnnotationType";
import { decode, encode } from "./rle";
import { isoLines } from "marchingsquares";

export const connectPoints = (
  coordinates: Array<Array<number>>,
  image: ImageJS.Image
) => {
  let connectedPoints: Array<Array<number>> = [];

  const foo = _.filter(
    _.zip(coordinates.slice(0, coordinates.length - 1), coordinates.slice(1)),
    ([current, next]) => {
      return !_.isEqual(current, next);
    }
  );
  foo.forEach(([current, next]) => {
    const points = drawLine(current!, next!);
    connectedPoints = _.concat(connectedPoints, points);
  });
  return connectedPoints;
};

export const drawLine = (p: Array<number>, q: Array<number>) => {
  const coords: Array<Array<number>> = [];

  let x: number,
    y: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    dx: number,
    dy: number,
    step: number,
    i: number;

  x1 = Math.round(p[0]);
  y1 = Math.round(p[1]);
  x2 = Math.round(q[0]);
  y2 = Math.round(q[1]);

  dx = x2 - x1;
  dy = y2 - y1;

  step = Math.abs(dy);

  if (Math.abs(dx) >= Math.abs(dy)) {
    step = Math.abs(dx);
  }

  dx = dx / step;
  dy = dy / step;
  x = x1;
  y = y1;
  i = 1;

  while (i <= step) {
    coords.push([Math.round(x), Math.round(y)]);
    x = x + dx;
    y = y + dy;
    i = i + 1;
  }

  return coords;
};

export const getIdx = (width: number, nchannels: number) => {
  return (x: number, y: number, index: number) => {
    index = index || 0;
    return Math.floor((width * y + x) * nchannels + index);
  };
};

/*
Given a click at a position, return all overlapping annotations ids
 */
export const getOverlappingAnnotations = (
  position: { x: number; y: number },
  annotations: Array<AnnotationType>
) => {
  const overlappingAnnotations = annotations.filter(
    (annotation: AnnotationType) => {
      const boundingBox = annotation.boundingBox;
      if (
        position.x >= boundingBox[0] &&
        position.x <= boundingBox[2] &&
        position.y >= boundingBox[1] &&
        position.y <= boundingBox[3]
      ) {
        return annotation;
      }
    }
  );
  return overlappingAnnotations.map((annotation: AnnotationType) => {
    return annotation.id;
  });
};

export const getAnnotationsInBox = (
  minimum: { x: number; y: number },
  maximum: { x: number; y: number },
  annotations: Array<AnnotationType>
) => {
  return annotations.filter((annotation: AnnotationType) => {
    return (
      minimum.x <= annotation.boundingBox[0] &&
      minimum.y <= annotation.boundingBox[1] &&
      maximum.x >= annotation.boundingBox[2] &&
      maximum.y >= annotation.boundingBox[3]
    );
  });
};

export const invertMask = (
  mask: Array<number>,
  encoded = false
): Array<number> => {
  if (encoded) {
    mask = Array.from(decode(mask));
  }

  mask.forEach((currentValue: number, index: number) => {
    if (currentValue === 255) {
      mask[index] = 0;
    } else mask[index] = 255;
  });

  if (encoded) {
    mask = encode(Uint8Array.from(mask));
  }
  return mask;
};

export const invertContour = (
  contour: Array<number>,
  imageWidth: number,
  imageHeight: number
): Array<number> => {
  //using https://jsbin.com/tevejujafi/3/edit?html,js,output and https://en.wikipedia.org/wiki/Nonzero-rule
  const frame = [
    0,
    0,
    imageWidth,
    0,
    imageWidth,
    imageHeight,
    0,
    imageHeight,
    0,
    0,
  ];
  const counterClockWiseContours = _.flatten(_.reverse(_.chunk(contour, 2)));
  return _.concat(frame, counterClockWiseContours);
};

export const computeBoundingBoxFromContours = (
  contour: Array<number>
): [number, number, number, number] => {
  const pairs = _.chunk(contour, 2);

  return [
    Math.round(_.min(_.map(pairs, _.first))!),
    Math.round(_.min(_.map(pairs, _.last))!),
    Math.round(_.max(_.map(pairs, _.first))!),
    Math.round(_.max(_.map(pairs, _.last))!),
  ];
};

export const computeBoundingBoxFromMask = (
  encoded: Array<number>,
  imageWidth: number,
  imageHeight: number
): [number, number, number, number] => {
  const decodedData = decode(encoded);
  let x, y: number;
  let minX = decodedData.length / imageHeight;
  let maxX = 0;
  let minY = decodedData.length / imageWidth;
  let maxY = 0;
  for (let i = 0; i < decodedData.length; i++) {
    if (decodedData[i]) {
      y = Math.floor(i / imageWidth);
      x = i % imageWidth;
      if (y > maxY) maxY = y;
      else if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      else if (x < minX) minX = x;
    }
  }
  return [minX, minY, maxX, maxY];
};

export const computeContoursFromIsolines = (
  data: Array<Array<number>>
): Array<number> => {
  //pad array to obtain better estimate of contours around mask
  const pad = 10;
  const padY = new Array(data[0].length + 2 * pad).fill(0);
  const padX = new Array(pad).fill(0);

  const paddedMatrix: Array<Array<number>> = [];

  let i;
  for (i = 0; i < pad; i++) {
    paddedMatrix.push(padY);
  }
  data.forEach((row: Array<number>) => {
    paddedMatrix.push(padX.concat(row).concat(padX));
  });
  for (i = 0; i < pad; i++) {
    paddedMatrix.push(padY);
  }

  const largestIsolines = isoLines(paddedMatrix, 1).sort(
    (a: Array<number>, b: Array<number>) => {
      return b.length - a.length;
    }
  );

  let largestIsoline = largestIsolines[0];

  if (largestIsoline.length <= 5) return [];

  return _.flatten(
    largestIsoline.map((coord: Array<number>) => {
      return [Math.round(coord[0] - pad), Math.round(coord[1] - pad)];
    })
  );
};

/*
 * From encoded mask data, get the decoded data and return results as an HTMLImageElement to be used by Konva.Image
 */
export const colorOverlayROI = (
  encodedMask: Array<number>,
  boundingBox: [number, number, number, number],
  imageWidth: number,
  imageHeight: number,
  color: Array<number>
): HTMLImageElement | undefined => {
  if (!encodedMask) return undefined;

  const decodedData = decode(encodedMask);

  //extract bounding box params
  const boxWidth = boundingBox[2] - boundingBox[0];
  const boxHeight = boundingBox[3] - boundingBox[1];
  const boxX = boundingBox[0];
  const boxY = boundingBox[1];

  const fullImage = new ImageJS.Image(imageWidth, imageHeight, decodedData, {
    components: 1,
    alpha: 0,
  });

  const croppedImage = fullImage.crop({
    x: boxX,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
  });

  const colorROIImage = new ImageJS.Image(boxWidth, boxHeight, {
    components: 3,
    alpha: 1,
  });

  for (let i = 0; i < croppedImage.width; i++) {
    for (let j = 0; j < croppedImage.height; j++) {
      if (croppedImage.getPixelXY(i, j)[0] > 0) {
        colorROIImage.setPixelXY(i, j, [color[0], color[1], color[2], 128]);
      } else {
        colorROIImage.setPixelXY(i, j, [0, 0, 0, 0]);
      }
    }
  }

  const src = colorROIImage.toDataURL("image-png", {
    useCanvas: true,
  });
  const image = new Image();
  image.src = src;

  return image;
};
