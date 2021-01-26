import {Selection} from "./Selection";

export class ObjectSelection extends Selection {
  public deselect(): void {}

  public onMouseDown(position: { x: number; y: number }): void {}

  public onMouseMove(position: { x: number; y: number }): void {}

  public onMouseUp(position: { x: number; y: number }): void {}
}
