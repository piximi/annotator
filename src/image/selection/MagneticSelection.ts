import { Selection } from "./Selection";

export class MagneticSelection extends Selection {
  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {}

  onMouseMove(position: { x: number; y: number }) {}

  onMouseUp(position: { x: number; y: number }) {}

  select(category: string) {};
}
