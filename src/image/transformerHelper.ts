import * as _ from "lodash";
import * as ImageJS from "image-js";
import { connectPoints } from "./imageHelper";
import { simplify } from "./simplify/simplify";
import { slpf } from "./polygon-fill/slpf";
import { encode } from "./rle";
import Konva from "konva";

export const resizeContour = (
  contour: Array<number>,
  center: { x: number; y: number },
  scale: { x: number; y: number }
) => {
  return _.flatten(
    _.map(_.chunk(contour, 2), (el: Array<number>) => {
      return [
        center.x + scale.x * (el[0] - center.x),
        center.y + scale.y * (el[1] - center.y),
      ];
    })
  );
};

export const resizeMask = (
  points: Array<number>,
  imageWidth: number,
  imageHeight: number
) => {
  const maskImage = new ImageJS.Image({
    width: imageWidth,
    height: imageHeight,
    bitDepth: 8,
  });

  const coords = _.chunk(points, 2);

  const connectedPoints = connectPoints(coords, maskImage); // get coordinates of connected points and draw boundaries of mask
  simplify(connectedPoints, 1, true);
  slpf(connectedPoints, maskImage);

  //@ts-ignore
  return encode(maskImage.getChannel(0).data);
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

export const getOppositeAnchorPosition = (transformer: Konva.Transformer) => {
  const activeAnchor = transformer.getActiveAnchor();
  switch (activeAnchor) {
    case "bottom-right": {
      return transformer.findOne(".".concat("top-left")).position();
    }
    case "bottom-center": {
      return transformer.findOne(".".concat("top-center")).position();
    }
    case "bottom-left": {
      return transformer.findOne(".".concat("top-right")).position();
    }
    case "middle-left": {
      return transformer.findOne(".".concat("middle-right")).position();
    }
    case "top-left": {
      return transformer.findOne(".".concat("bottom-right")).position();
    }
    case "top-center": {
      return transformer.findOne(".".concat("bottom-center")).position();
    }
    case "top-right": {
      return transformer.findOne(".".concat("bottom-left")).position();
    }
    case "middle-right": {
      return transformer.findOne(".".concat("middle-left")).position();
    }
    default: {
      return { x: 0, y: 0 };
    }
  }
};
