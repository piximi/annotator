import {Selection} from "./Selection";

export class QuickSelection extends Selection {
  deselect(): void {}

  onMouseDown(position: { x: number; y: number }): void {}

  onMouseMove(position: { x: number; y: number }): void {}

  onMouseUp(position: { x: number; y: number }): void {}

  select() {};
}
