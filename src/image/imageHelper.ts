import { TypedArray } from "@tensorflow/tfjs";

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

  // find next clockwise pixel in neighborhood of currBoundary, from enteredFrom
  pointer = clockwise.indexOf(
    [currBoundary.x - enteredFrom.x, currBoundary.y - enteredFrom.y],
    0
  );
  candidate = {
    x: currBoundary.x + clockwise[pointer + 1][1],
    y: currBoundary.y + clockwise[pointer + 1][0],
  };

  while (
    candidate.x !== firstPointCoord.x ||
    candidate.y !== firstPointCoord.y
  ) {
    debugger;
    if (data[idx(candidate.x, candidate.y, 0)] === 255) {
      boundaries.push(candidate);
      enteredFrom = currBoundary;
      currBoundary = candidate;

      pointer = clockwise.indexOf(
        [currBoundary.x - enteredFrom.x, currBoundary.y - enteredFrom.y],
        0
      );
      candidate = {
        x: currBoundary.x + clockwise[pointer + 1][1],
        y: currBoundary.y + clockwise[pointer + 1][0],
      };
    } else {
      enteredFrom = candidate;
      pointer = clockwise.indexOf(
        [currBoundary.x - enteredFrom.x, currBoundary.y - enteredFrom.y],
        0
      );
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

export const sobel = (imageData: ImageData) => {
  const kernelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ];
  const kernelY = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ];
  const width = imageData.width;
  const height = imageData.height;

  const grayscale = [];
  var data = imageData.data;

  const idx = getIdx(width, 4);

  const output = [];

  const threshold = 150;

  let x, y;
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      const r = data[idx(x, y, 0)];
      const g = data[idx(x, y, 1)];
      const b = data[idx(x, y, 2)];

      const mean = (r + g + b) / 3;

      grayscale[idx(x, y, 0)] = mean;
      grayscale[idx(x, y, 1)] = mean;
      grayscale[idx(x, y, 2)] = mean;
    }
  }

  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      const responseX =
        kernelX[0][0] * grayscale[idx(x - 1, y - 1, 0)] +
        kernelX[0][1] * grayscale[idx(x + 0, y - 1, 0)] +
        kernelX[0][2] * grayscale[idx(x + 1, y - 1, 0)] +
        kernelX[1][0] * grayscale[idx(x - 1, y + 0, 0)] +
        kernelX[1][1] * grayscale[idx(x + 0, y + 0, 0)] +
        kernelX[1][2] * grayscale[idx(x + 1, y + 0, 0)] +
        kernelX[2][0] * grayscale[idx(x - 1, y + 1, 0)] +
        kernelX[2][1] * grayscale[idx(x + 0, y + 1, 0)] +
        kernelX[2][2] * grayscale[idx(x + 1, y + 1, 0)];

      const responseY =
        kernelY[0][0] * grayscale[idx(x - 1, y - 1, 0)] +
        kernelY[0][1] * grayscale[idx(x + 0, y - 1, 0)] +
        kernelY[0][2] * grayscale[idx(x + 1, y - 1, 0)] +
        kernelY[1][0] * grayscale[idx(x - 1, y + 0, 0)] +
        kernelY[1][1] * grayscale[idx(x + 0, y + 0, 0)] +
        kernelY[1][2] * grayscale[idx(x + 1, y + 0, 0)] +
        kernelY[2][0] * grayscale[idx(x - 1, y + 1, 0)] +
        kernelY[2][1] * grayscale[idx(x + 0, y + 1, 0)] +
        kernelX[2][2] * grayscale[idx(x + 1, y + 1, 0)];

      const magnitude =
        Math.sqrt(responseX * responseX + responseY * responseY) >>> 0;

      // data[idx(x, y, 0)] = magnitude > threshold ? 255 : 0;
      // data[idx(x, y, 1)] = magnitude > threshold ? 255 : 0;
      // data[idx(x, y, 2)] = magnitude > threshold ? 255 : 0;

      output[getIdx(width, 1)(x, y, 0)] = magnitude > threshold ? 0 : 1;
    }
  }
  return output;
};
