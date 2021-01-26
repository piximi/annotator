import {Selection} from "./Selection";

export default class QuickSelection extends Selection {
  public deselect(): void {}

  public onMouseDown(position: { x: number; y: number }): void {}

  public onMouseMove(position: { x: number; y: number }): void {}

  public onMouseUp(position: { x: number; y: number }): void {}
}
