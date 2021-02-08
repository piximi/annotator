import * as _ from "lodash";
import * as ImageJS from "image-js";

export const drawLine = (
  image: ImageJS.Image,
  p: Array<number>,
  q: Array<number>
) => {
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
    image.setPixelXY(x, y, [255, 255, 255, 255]);
    x = x + Math.round(dx);
    y = y + Math.round(dy);
    i = i + 1;
  }
};

const findFirstWhitePixel = (
  data: Uint8ClampedArray,
  height: number,
  width: number,
  nchannels: number
) => {
  const idx = getIdx(width, nchannels);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixel = data[idx(x, y, 0)];
      if (pixel === 255) {
        return { x: x, y: y };
      }
    }
  }
  return;
};

export const mooreNeighborhood = (
  data: Uint8ClampedArray,
  height: number,
  width: number,
  nchannels: number
) => {
  const boundaries: { x: number; y: number }[] = [];
  const idx = getIdx(width, nchannels);

  let currBoundary: { x: number; y: number };
  let enteredFrom: { x: number; y: number };
  let candidate: { x: number; y: number };
  let pointer: number;

  const clockwise = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
  ];

  const firstPointCoord = findFirstWhitePixel(data, height, width, nchannels);

  if (!firstPointCoord) return;

  boundaries.push(firstPointCoord);

  currBoundary = firstPointCoord;
  enteredFrom = { x: firstPointCoord.x - 1, y: firstPointCoord.y };

  pointer = clockwise.findIndex((tuple) => {
    return (
      tuple[0] === currBoundary.y - enteredFrom.y &&
      tuple[1] === currBoundary.x - enteredFrom.x
    );
  });
  //FIXME this should only consider the allowed neighbors (or you'll run into problems getting neighbors from sides and corners)
  candidate = {
    x: currBoundary.x + clockwise[pointer + 1][1],
    y: currBoundary.y + clockwise[pointer + 1][0],
  };

  while (
    candidate.x !== firstPointCoord.x ||
    candidate.y !== firstPointCoord.y
  ) {
    if (data[idx(candidate.x, candidate.y, 0)] === 255) {
      boundaries.push(candidate);
      enteredFrom = currBoundary;
      currBoundary = candidate;

      pointer = clockwise.findIndex((tuple) => {
        return (
          tuple[0] === currBoundary.y - enteredFrom.y &&
          tuple[1] === currBoundary.x - enteredFrom.x
        );
      });
      //FIXME this should only consider the allowed neighbors (or you'll run into problems getting neighbors from sides and corners)

      candidate = {
        x: currBoundary.x + clockwise[pointer + 1][1],
        y: currBoundary.y + clockwise[pointer + 1][0],
      };
    } else {
      enteredFrom = candidate;
      pointer = clockwise.findIndex((tuple) => {
        return (
          tuple[0] === currBoundary.y - enteredFrom.y &&
          tuple[1] === currBoundary.x - enteredFrom.x
        );
      });
      //FIXME this should only consider the allowed neighbors (or you'll run into problems getting neighbors from sides and corners)

      candidate = {
        x: currBoundary.x + clockwise[pointer + 1][1],
        y: currBoundary.y + clockwise[pointer + 1][0],
      };
    }
  }
  return boundaries;
};

export const getIdx = (width: number, nchannels: number) => {
  return (x: number, y: number, index: number) => {
    index = index || 0;
    return (width * y + x) * nchannels + index;
  };
};
