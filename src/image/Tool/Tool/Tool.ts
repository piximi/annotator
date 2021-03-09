import * as ImageJS from "image-js";

export abstract class Tool {
  image: ImageJS.Image;

  protected constructor(image: ImageJS.Image) {
    this.image = image;
  }
}
