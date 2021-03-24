import { Shape } from "./Shape";
import { Selection } from "./Selection";

export type Image = {
  categoryId?: string;
  id: string;
  instances: Array<Selection>;
  name: string;
  shape?: Shape;
  src: string;
};
