import * as ImageJS from "image-js";

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
  image: ImageJS.Image;
}) => {
  // if (!image) {
  //   console.log("Error - No image");
  //   return;
  // }
  // image.target = new Position(x, y);
  // image.overlayTolerance = -1;
  // image.overlay = new ImageJS.Image(
  //   image.width,
  //   image.height,
  //   new Uint8ClampedArray(image.width * image.height * 4),
  //   { alpha: 1 }
  // );

  const tol: Array<number> = [];

  const color = image.getPixelXY(x, y);

  for (let i = 0; i < image.data.length; i += 4) {
    const red = Math.abs(image.data[i] - color[0]);
    const green = Math.abs(image.data[i + 1] - color[1]);
    const blue = Math.abs(image.data[i + 2] - color[2]);
    tol.push(Math.floor((red + green + blue) / 3));
  }

  return new ImageJS.Image(image.width, image.height, tol, {
    alpha: 0,
    components: 1,
  });
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
  image: ImageJS.Image;
  tolerance: number;
  color: string;
}) => {
  let overlay = new ImageJS.Image(
    image.width,
    image.height,
    new Uint8ClampedArray(image.width * image.height * 4),
    { alpha: 1 }
  );
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const fillColor = [r, g, b, 150];

  let roi = overlay.getRoiManager();

  // Use the watershed function with a single seed to determine the selected region.
  // @ts-ignore
  roi.fromWaterShed({
    image: image,
    fillMaxValue: tolerance,
    points: [[x, y]],
  });

  // @ts-ignore
  let mask = roi.getMasks()[0];

  // roiPaint doesn't respect alpha, so we'll paint it ourselves.
  for (let x = 0; x < mask.width; x++) {
    for (let y = 0; y < mask.height; y++) {
      if (mask.getBitXY(x, y)) {
        overlay.setPixelXY(
          x + mask.position[0],
          y + mask.position[1],
          fillColor
        );
      }
    }
  }

  // Set the origin point to white, for visibility.
  overlay.setPixelXY(x, y, [255, 255, 255, 255]);
  return overlay.toDataURL();
};
