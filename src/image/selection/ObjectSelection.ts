import { Selection } from "./Selection";

export class ObjectSelection extends Selection {
  get box(): [number, number, number, number] | undefined {
    return undefined;
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {}

  onMouseMove(position: { x: number; y: number }) {}

  onMouseUp(position: { x: number; y: number }) {}

  select(category: number) {};
}
