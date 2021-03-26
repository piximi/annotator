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
  const tol: Array<number> = [];

  const color = image.getPixelXY(x, y);

  if (image.data.length === image.width * image.height * 3) {
    //RGB image
    for (let i = 0; i < image.data.length; i += 3) {
      const red = Math.abs(image.data[i] - color[0]);
      const green = Math.abs(image.data[i + 1] - color[1]);
      const blue = Math.abs(image.data[i + 2] - color[2]);
      tol.push(Math.floor((red + green + blue) / 3));
    }
  } else if (image.data.length === image.width * image.height * 4) {
    //RGBA image
    for (let i = 0; i < image.data.length; i += 4) {
      const red = Math.abs(image.data[i] - color[0]);
      const green = Math.abs(image.data[i + 1] - color[1]);
      const blue = Math.abs(image.data[i + 2] - color[2]);
      tol.push(Math.floor((red + green + blue) / 3));
    }
  } else if (image.data.length === image.width * image.height) {
    //gresycale
    for (let i = 0; i < image.data.length; i++) {
      const grey = Math.abs(image.data[i] - color[0]);
      tol.push(Math.floor(grey));
    }
  }

  return new ImageJS.Image(image.width, image.height, tol, {
    alpha: 0,
    components: 1,
  });
};
