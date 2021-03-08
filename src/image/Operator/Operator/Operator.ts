import * as ImageJS from "image-js";

export abstract class Operator {
  image: ImageJS.Image;

  constructor(image: ImageJS.Image) {
    this.image = image;
  }
}
