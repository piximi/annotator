import * as _ from "lodash";
import * as ImageJS from "image-js";
import { AnnotationType } from "../types/AnnotationType";
import { decode, encode } from "./rle";

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
