import * as ImageJS from "image-js";
import {RoiManager} from "image-js";

class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(that: Position) {
    this.x += that.x;
    this.y += that.y;

    return this;
  }

  clone() {
    return new Position(this.x, this.y);
  }

  in(maximum: Position) {
    return this.x >= 0 && this.x <= maximum.x && this.y >= 0 && maximum.y;
  }

  overwrite(that: Position) {
    this.x = that.x;
    this.y = that.y;

    return this;
  }

  subtract(that: Position) {
    this.x -= that.x;
    this.y -= that.y;

    return this;
  }
}

export interface FloodImage extends ImageJS.Image {
  overlay: ImageJS.Image;
  toleranceMap: ImageJS.Image;
  target: Position;
  overlayTolerance: number;
}

// Generate a tolerance map and associate it with the image itself
export const makeFloodMap = ({
                               x,
                               y,
                               image,
                             }: {
  x: number;
  y: number;
  image: FloodImage;
}) => {
  if (!image) {
    console.log("Error - No image");
    return;
  }
  image.target = new Position(x, y);
  image.overlayTolerance = -1;
  image.overlay = new ImageJS.Image(
      image.width,
      image.height,
      new Uint8ClampedArray(image.width * image.height * 4),
      { alpha: 1 }
  );

  let start: number = y * image.width + x;

  image.visit = [start];

  image.rejected = new Set();

  image.visited = new Set();

  const tol: Array<number> = [];

  const color = image.getPixelXY(x, y);

  for (let i = 0; i < image.data.length; i += 4) {
    const red = Math.abs(image.data[i] - color[0]);
    const green = Math.abs(image.data[i+1] - color[1]);
    const blue = Math.abs(image.data[i+2] - color[2]);
    tol.push(Math.floor((red + green + blue)/3));
  }

  image.toleranceMap = new ImageJS.Image(image.width, image.height, tol, {
    alpha: 0,
    components: 1,
  });
  return image;
};

export const floodPixels = ({
                              x,
                              y,
                              image,
                              tolerance,
                              color,
                            }: {
  x: number;
  y: number;
  image: FloodImage;
  tolerance: number;
  color: string;
}) => {
  let overlay = new ImageJS.Image(
      image.width,
      image.height,
      new Uint8ClampedArray(image.width * image.height * 4),
      {alpha: 1}
  );
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const fillColor = [r, g, b, 150];

  let roi = overlay.getRoiManager();

  roi.fromWaterShed({image: image.toleranceMap, fillMaxValue: tolerance, points: [[x, y]]})

  let mask = roi.getMasks()[0]

  // roiPaint doesn't respect alpha, so we'll paint it ourselves.
  for (let x = 0; x < mask.width; x++) {
    for (let y = 0; y < mask.height; y++) {
      if (mask.getBitXY(x, y)) {
        for (
            let component = 0;
            component < fillColor.length;
            component++
        ) {
          overlay.setValueXY(
                x + mask.position[0],
                y + mask.position[1],
                component,
                fillColor[component],
            );
          }
          }
        }
        }

  // Set the origin point to white, for visibility.
  overlay.setPixelXY(x, y, [255, 255, 255, 255])
  return overlay.toDataURL()
}

// Original implementation, currently disabled
export const flood = ({
                        x,
                        y,
                        image,
                        tolerance,
                      }: {
  x: number;
  y: number;
  image: ImageJS.Image;
  tolerance: number;
}) => {
  const overlay = new ImageJS.Image(
      image.width,
      image.height,
      new Uint8ClampedArray(image.data.length),
      { alpha: 1 }
  );

  let position: Position = new Position(x, y);

  const color = image.getPixelXY(x, y);

  const boundary = new Position(image.width, image.height);

  let start: number = position.y * boundary.x + position.x;

  let visit: Array<number> = [start];

  const visited = new Set();

  const directions: Array<Position> = [
    new Position(-1, 0),
    new Position(1, 0),
    new Position(0, -1),
    new Position(0, 1),
  ];

  // const positivePixels = [];

  while (visit.length > 0) {
    const testIndex = visit.shift()!;

    position.x = testIndex % boundary.x;
    position.y = Math.floor(testIndex / (boundary.x === 0 ? 1 : boundary.x));
    const data = image.getPixelXY(position.x, position.y);

    visited.add(testIndex);

    const difference: number = Math.abs(
        data[0] - color[0] + (data[1] - color[1]) + (data[2] - color[2])
    );
    image.toleranceMap.setPixelXY(position.x, position.y, [difference]);
    if (difference <= tolerance) {
      // positivePixels.push(new Position(position.x, position.y));
      overlay.setPixelXY(position.x, position.y, [100, 100, 255, 150]);
      const next: Position = new Position(0, 0);

      for (const direction of directions) {
        next.overwrite(new Position(position.x, position.y)).add(direction);

        if (next.in(boundary)) {
          const nextIndex = next.y * image.width + next.x;

          if (!visit.includes(nextIndex) && !visited.has(nextIndex)) {
            visit.push(nextIndex);
          }
        }
      }
    }
  }
  overlay.setPixelXY(x, y, [255, 255, 255, 255]);
  return overlay.toDataURL();
};


export default function paintMasks(masks, options = {}) {
  let {
    alpha = 255,
    labels = [],
    labelsPosition = [],
    labelColor = 'blue',
    labelFont = '12px Helvetica',
  } = options;

  let colors = getColors(
      Object.assign({}, options, { numberColors: masks.length }),
  );

  if (!Array.isArray(masks)) {
    masks = [masks];
  }

  for (let i = 0; i < masks.length; i++) {
    let mask = masks[i];
    // we need to find the parent image to calculate the relative position
    let color = colors[i % colors.length];
    for (let x = 0; x < mask.width; x++) {
      for (let y = 0; y < mask.height; y++) {
        if (mask.getBitXY(x, y)) {
          for (
              let component = 0;
              component < Math.min(this.components, color.length);
              component++
          ) {
            if (alpha === 255) {
              this.setValueXY(
                  x + mask.position[0],
                  y + mask.position[1],
                  component,
                  color[component],
              );
            } else {
              let value = this.getValueXY(
                  x + mask.position[0],
                  y + mask.position[1],
                  component,
              );
              value = Math.round(
                  (value * (255 - alpha) + color[component] * alpha) / 255,
              );
              this.setValueXY(
                  x + mask.position[0],
                  y + mask.position[1],
                  component,
                  value,
              );
            }
          }
        }
      }
    }
  }

  if (Array.isArray(labels) && labels.length > 0) {
    let canvas = this.getCanvas();
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = labelColor;
    ctx.font = labelFont;
    for (let i = 0; i < Math.min(masks.length, labels.length); i++) {
      let position = labelsPosition[i] ? labelsPosition[i] : masks[i].position;
      ctx.fillText(labels[i], position[0], position[1]);
    }
    this.data = Uint8Array.from(
        ctx.getImageData(0, 0, this.width, this.height).data,
    );
  }

  return this;
}